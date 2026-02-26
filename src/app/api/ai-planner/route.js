import { NextResponse } from "next/server";

// Using Google's official OpenAI-compatible wrapper with the guaranteed latest model string
const GEMINI_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GEMINI_MODEL = "llama-3.3-70b-versatile";


export async function POST(req) {
  try {
    const body = await req.json();
    const {
      tasks,
      exams,
      timetable,
      subjects,
      history,
      cgpaGoal,
      sem,
      prefs,
      profile,
      currentTime,
      currentTimeFormatted,
    } = body;

    // Check if key exists
    if (!process.env.GEMINI_API_KEY) {
      throw new Error(
        "GEMINI_API_KEY is missing. Add it to .env.local and restart your server.",
      );
    }

    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const todayName = today.toLocaleDateString("en-US", { weekday: "long" });
    const nowLabel =
      currentTimeFormatted ||
      today.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

    const attendanceWarnings = (subjects || [])
      .filter((s) => (s.attendance || 100) < (prefs?.attendanceThreshold || 75))
      .map((s) => `${s.name}: ${s.attendance}% (below threshold)`);

    const pendingTasks = (tasks || []).filter((t) => !t.done);
    const doneTasks = (tasks || []).filter((t) => t.done);

    const urgentExams = (exams || [])
      .map((e) => ({
        ...e,
        daysLeft: Math.ceil((new Date(e.date) - Date.now()) / 86400000),
      }))
      .filter((e) => e.daysLeft >= 0 && e.daysLeft <= 30)
      .sort((a, b) => a.daysLeft - b.daysLeft);

    const todaySlots = (timetable[todayName] || [])
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
      .map((s) => `${s.startTime}–${s.endTime}: ${s.subject}`);

    const systemPrompt = `You are an intelligent academic coach for a BTech engineering student in India.
Your job is to give brutally honest, highly personalized, actionable study plans and advice.
Always respond ONLY with valid JSON matching the exact schema requested. No markdown, no prose outside JSON.`;

    const userPrompt = `
Today: ${todayStr} (${todayName})
Current Time: ${nowLabel} — IMPORTANT: Only schedule study sessions AFTER this time. Do NOT suggest sessions that have already passed. You MUST include short breaks (e.g., 10-15 mins) labeled as "Break".

Student Profile:
- Name: ${profile?.name || "Student"}
- CGPA Goal: ${cgpaGoal}/10

Performance Summary:
- Today's tasks: ${doneTasks.length} done / ${(tasks || []).length} total
- Pending tasks today: ${pendingTasks.length}

Today's Classes:
${todaySlots.length > 0 ? todaySlots.join("\n") : "No classes today"}

Upcoming Exams (next 30 days):
${urgentExams.length > 0 ? urgentExams.map((e) => `- ${e.subject}: ${e.daysLeft} days away`).join("\n") : "None"}

Pending Tasks:
${pendingTasks.length > 0 ? pendingTasks.map((t) => `- ${t.title || t.text || "Task"}`).join("\n") : "None"}

Attendance Risks:
${attendanceWarnings.length > 0 ? attendanceWarnings.join("\n") : "None"}

Now generate a complete AI study plan. Return ONLY this exact JSON structure:
{
  "greeting": "A short, personal 1-line greeting",
  "scoreLabel": "short label like 'At Risk' | 'Needs Work' | 'On Track'",
  "scoreColor": "red|orange|yellow|green",
  "insights":[
    {
      "type": "warning|tip|success|urgent",
      "icon": "⚠️|💡|✅|🔥",
      "title": "short title",
      "body": "1 sentence insight"
    }
  ],
  "todayPlan":[
    {
      "time": "e.g. 6:00 PM – 7:00 PM",
      "subject": "subject name (use 'Break' for short breaks)",
      "task": "specific task description",
      "priority": "high|medium|low|none",
      "pomodoros": 2,
      "reason": "1 sentence reason"
    }
  ],
  "weekPlan":[
    {
      "day": "Monday",
      "date": "YYYY-MM-DD",
      "focus": "main subject",
      "sessions": 2,
      "keyTask": "key task",
      "examAlert": "exam name if within 3 days else null"
    }
  ],
  "examStrategy":[
    {
      "subject": "subject name",
      "daysLeft": 5,
      "hoursNeeded": 10,
      "dailyHours": 2,
      "strategy": "2-sentence study strategy",
      "urgency": "critical|high|medium|low"
    }
  ],
  "attendanceAction": ${attendanceWarnings.length > 0 ? `"Action to recover attendance"` : "null"},
  "motivationalNote": "A 1-line push",
  "topPriority": "The single most important thing to do NOW"
}`;

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
      },
      body: JSON.stringify({
        model: GEMINI_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Extract exact error regardless of whether it's an object or an array
      let actualError = "Unknown Gemini API error";
      if (Array.isArray(data) && data[0]?.error?.message) {
        actualError = data[0].error.message;
      } else if (data.error?.message) {
        actualError = data.error.message;
      } else {
        actualError = JSON.stringify(data); // Show raw output if parsing fails
      }
      throw new Error(`API Error: ${actualError}`);
    }

    let raw = data.choices?.[0]?.message?.content;

    if (!raw) {
      throw new Error("Empty response from AI");
    }

    // Bulletproof JSON extraction
    raw = raw
      .replace(/```json/gi, "")
      .replace(/```/gi, "")
      .trim();
    const firstBrace = raw.indexOf("{");
    const lastBrace = raw.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1) {
      raw = raw.substring(firstBrace, lastBrace + 1);
    }

    let plan;
    try {
      plan = JSON.parse(raw);
    } catch (parseErr) {
      throw new Error("AI returned invalid JSON. Please try generating again.");
    }

    return NextResponse.json({ success: true, plan, generatedAt: Date.now() });
  } catch (err) {
    console.error("AI planner error:", err);
    return NextResponse.json(
      { error: "Internal error", details: err.message },
      { status: 500 },
    );
  }
}
