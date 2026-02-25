import { NextResponse } from "next/server";

// Using Google Gemini's OpenAI-compatible endpoint
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
const GEMINI_MODEL = "gemini-1.5-flash";

export async function POST(req) {
  try {
    const { messages, contextData, plan } = await req.json();

    const systemPrompt = `You are an intelligent, supportive, and practical AI academic coach for an engineering student.
Your goal is to answer their questions, give advice based on their current study data, and keep them motivated. Keep your answers concise, well-formatted, and friendly.

Here is the student's current academic context:
- Name: ${contextData?.profile?.name || "Student"}
- CGPA Goal: ${contextData?.cgpaGoal || "8.5"}/10
- Semester: ${contextData?.sem || "Current"}

Here is the exact CURRENT daily plan you generated for them today:
${plan ? JSON.stringify(plan.todayPlan, null, 2) : "No plan generated yet."}

CRITICAL INSTRUCTION - MODIFYING THE PLAN (ADD, EDIT, DELETE):
If the user explicitly asks to ADD, DELETE, or CHANGE any subjects/times in their "Today's Plan", you MUST do two things:
1. First, reply with a short conversational message saying what you added, changed, or deleted.
2. Second, at the VERY END of your response, you MUST append the FULL, newly updated JSON array containing ALL of their remaining todayPlan sessions.
3. You MUST wrap this updated JSON array EXACTLY between <UPDATE_PLAN> and </UPDATE_PLAN> tags. Do NOT put markdown formatting (like \`\`\`json) around or inside the tags. Just output the raw JSON array.

Example Response for adding/editing/deleting:
Got it! I have added Machine Learning from 12:00 AM to 1:00 AM, added a short break, and removed Algorithms as requested.
<UPDATE_PLAN>[
  {
    "time": "12:00 AM – 1:00 AM",
    "subject": "Machine Learning",
    "task": "Study ML basics",
    "priority": "high",
    "pomodoros": 2,
    "reason": "User requested addition"
  },
  {
    "time": "1:00 AM – 1:20 AM",
    "subject": "Break",
    "task": "Take a short rest",
    "priority": "none",
    "pomodoros": 0,
    "reason": "Rest"
  }
]
</UPDATE_PLAN>

Make sure the JSON array inside the tags contains their ENTIRE schedule for the rest of the day, reflecting the changes requested. If they don't ask to modify the plan, just answer them normally without the tags.`;

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
      },
      body: JSON.stringify({
        model: GEMINI_MODEL,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini chat error:", err);
      return NextResponse.json(
        { error: "AI service error", details: err },
        { status: 500 },
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      return NextResponse.json(
        { error: "Empty response from AI" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, reply });
  } catch (err) {
    console.error("AI Chat Error:", err);
    return NextResponse.json(
      { error: "Internal error", details: err.message },
      { status: 500 },
    );
  }
}
