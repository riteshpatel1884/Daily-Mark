import { NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile"; // fast + smart

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

    // ── Build rich context prompt ──────────────────────────────────────────
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const todayName = today.toLocaleDateString("en-US", { weekday: "long" });
    // Use client-sent time if available, otherwise compute server-side
    const nowLabel =
      currentTimeFormatted ||
      today.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

    // Compute attendance risk per subject
    const attendanceWarnings = (subjects || [])
      .filter((s) => (s.attendance || 100) < (prefs?.attendanceThreshold || 75))
      .map(
        (s) =>
          `${s.name}: ${s.attendance}% (below ${prefs?.attendanceThreshold || 75}% threshold)`,
      );

    // Pending tasks breakdown
    const pendingTasks = (tasks || []).filter((t) => !t.done);
    const doneTasks = (tasks || []).filter((t) => t.done);

    // Exams in next 30 days
    const urgentExams = (exams || [])
      .map((e) => ({
        ...e,
        daysLeft: Math.ceil((new Date(e.date) - Date.now()) / 86400000),
      }))
      .filter((e) => e.daysLeft >= 0 && e.daysLeft <= 30)
      .sort((a, b) => a.daysLeft - b.daysLeft);

    // Compute 7-day avg completion rate from history
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

    // Today's timetable
    const todaySlots = (timetable[todayName] || [])
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
      .map(
        (s) =>
          `${s.startTime}–${s.endTime}: ${s.subject}${s.room ? " (" + s.room + ")" : ""}`,
      );

    // Build the system + user prompt
    const systemPrompt = `You are an intelligent academic coach for a BTech engineering student in India.
You deeply understand the pressures of engineering college — CGPA anxiety, attendance rules, exam cramming, and procrastination.
Your job is to give brutally honest, highly personalized, actionable study plans and advice.
Be direct, specific, and motivating — not generic. Speak like a smart senior who actually cares.
Always respond ONLY with valid JSON matching the exact schema requested. No markdown, no prose outside JSON.`;

    const userPrompt = `
Today: ${todayStr} (${todayName})
Current Time: ${nowLabel} — IMPORTANT: Only schedule study sessions AFTER this time. Do NOT suggest sessions that have already passed. The earliest session in todayPlan must start at or after ${nowLabel}. You MUST include short breaks (e.g., 10-15 mins) between intense study sessions in the todayPlan (Label the subject as "Break").

Student Profile:
- Name: ${profile?.name || "Student"}
- Branch: ${profile?.branch || "CSE"}, ${profile?.year || "3rd Year"}
- Semester: ${sem}
- CGPA Goal: ${cgpaGoal}/10
- Study Mode: ${prefs?.studyMode || "Balanced"}
- Attendance Threshold: ${prefs?.attendanceThreshold || 75}%

Performance Summary:
- Today's tasks: ${doneTasks.length} done / ${(tasks || []).length} total
- 7-day avg completion rate: ${avgCompletion}%
- Pending tasks today: ${pendingTasks.length}

Today's Classes:
${todaySlots.length > 0 ? todaySlots.join("\n") : "No classes today"}

Upcoming Exams (next 30 days):
${urgentExams.length > 0 ? urgentExams.map((e) => `- ${e.subject} (${e.type}): ${e.daysLeft} days away${e.syllabus ? " | Topics: " + e.syllabus : ""}`).join("\n") : "No exams in next 30 days"}

Pending Tasks:
${pendingTasks.length > 0 ? pendingTasks.map((t) => `- [${t.type || "study"}] ${t.title || t.text || "Task"}`).join("\n") : "No pending tasks"}

Attendance Risks:
${attendanceWarnings.length > 0 ? attendanceWarnings.join("\n") : "All subjects above threshold"}

Subject History (last 7 days avg): ${avgCompletion}%
Raw history: ${JSON.stringify(histEntries.slice(0, 5).map(([date, v]) => ({ date, rate: v.rate, done: v.done, total: v.total })))}

Now generate a complete AI study plan. Return ONLY this exact JSON structure:
{
  "greeting": "A short, personal 1-line greeting using student's name and a relevant observation about their data",
  "scoreLabel": "short label like 'At Risk' | 'Needs Work' | 'On Track' | 'Crushing It'",
  "scoreColor": "red|orange|yellow|green",
  "insights":[
    {
      "type": "warning|tip|success|urgent",
      "icon": "⚠️|💡|✅|🔥",
      "title": "short title",
      "body": "2-3 sentences of specific, data-driven insight"
    }
  ],
  "todayPlan":[
    {
      "time": "e.g. 6:00 PM – 7:00 PM",
      "subject": "subject name (use 'Break' for short breaks)",
      "task": "specific task description",
      "priority": "high|medium|low|none",
      "pomodoros": <number>,
      "reason": "why this slot/subject now — 1 sentence"
    }
  ],
  "weekPlan":[
    {
      "day": "Monday",
      "date": "YYYY-MM-DD",
      "focus": "main subject/theme for the day",
      "sessions": <number of study sessions>,
      "keyTask": "the most important thing to do this day",
      "examAlert": "exam name if within 3 days of this day, else null"
    }
  ],
  "examStrategy":[
    {
      "subject": "subject name",
      "daysLeft": <number>,
      "hoursNeeded": <number>,
      "dailyHours": <number>,
      "strategy": "2-sentence study strategy specific to this exam and syllabus",
      "urgency": "critical|high|medium|low"
    }
  ],
  "attendanceAction": ${attendanceWarnings.length > 0 ? `"Specific action to recover attendance — which classes to not miss"` : "null"},
  "motivationalNote": "A personalized 2-line push based on their actual data — not generic. Reference their streak, or specific subject.",
  "topPriority": "The single most important thing they should do RIGHT NOW — be specific"
}`;

    const groqRes = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2500,
        response_format: { type: "json_object" },
      }),
    });

    if (!groqRes.ok) {
      const err = await groqRes.text();
      console.error("Groq error:", err);
      return NextResponse.json(
        { error: "AI service error", details: err },
        { status: 500 },
      );
    }

    const groqData = await groqRes.json();
    const raw = groqData.choices?.[0]?.message?.content;

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
