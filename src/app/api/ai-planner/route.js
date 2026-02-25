import { NextResponse } from "next/server";

// Using Google Gemini's OpenAI-compatible endpoint
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
const GEMINI_MODEL = "gemini-1.5-flash"; // extremely fast and huge limits

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
      .map(
        (s) =>
          `${s.name}: ${s.attendance}% (below ${prefs?.attendanceThreshold || 75}% threshold)`,
      );

    const pendingTasks = (tasks || []).filter((t) => !t.done);
    const doneTasks = (tasks || []).filter((t) => t.done);

    const urgentExams = (exams || [])
      .map((e) => ({
        ...e,
        daysLeft: Math.ceil((new Date(e.date) - Date.now()) / 86400000),
      }))
      .filter((e) => e.daysLeft >= 0 && e.daysLeft <= 30)
      .sort((a, b) => a.daysLeft - b.daysLeft);

    const histEntries = Object.entries(history || {})
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, 7);
    const avgCompletion =
      histEntries.length > 0
        ? Math.round(
            histEntries.reduce((s, [, v]) => s + (v.rate || 0), 0) /
              histEntries.length,
          )
        : 0;

    const todaySlots = (timetable[todayName] || [])
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
      .map(
        (s) =>
          `${s.startTime}–${s.endTime}: ${s.subject}${s.room ? " (" + s.room + ")" : ""}`,
      );

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
        max_tokens: 2500,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini error:", err);
      return NextResponse.json(
        { error: "AI service error", details: err },
        { status: 500 },
      );
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content;

    if (!raw) {
      return NextResponse.json(
        { error: "Empty response from AI" },
        { status: 500 },
      );
    }

    const plan = JSON.parse(raw);
    return NextResponse.json({ success: true, plan, generatedAt: Date.now() });
  } catch (err) {
    console.error("AI planner error:", err);
    return NextResponse.json(
      { error: "Internal error", details: err.message },
      { status: 500 },
    );
  }
}
