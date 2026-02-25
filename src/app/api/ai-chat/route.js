import { NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

export async function POST(req) {
  try {
    const { messages, contextData, plan } = await req.json();

    const systemPrompt = `You are an intelligent, supportive, and practical AI academic coach for an engineering student.
Your goal is to answer their questions, give advice based on their current study data, and keep them motivated. Keep your answers concise, well-formatted (use short paragraphs or bullet points if needed), and friendly.

Here is the student's current academic context:
- Name: ${contextData?.profile?.name || "Student"}
- CGPA Goal: ${contextData?.cgpaGoal || "8.5"}/10
- Semester: ${contextData?.sem || "Current"}
- Study Mode Preference: ${contextData?.prefs?.studyMode || "Balanced"}

Here is the daily plan you previously generated for them today (use this for context if they ask about 'my plan' or 'what to do next'):
${plan ? JSON.stringify(plan.todayPlan) : "No plan generated yet."}

Respond directly to their message below as their coach. Do not mention that you are an AI unless explicitly asked.`;

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
          ...messages, // Append history of user/assistant messages
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!groqRes.ok) {
      const err = await groqRes.text();
      console.error("Groq chat error:", err);
      return NextResponse.json(
        { error: "AI service error", details: err },
        { status: 500 },
      );
    }

    const groqData = await groqRes.json();
    const reply = groqData.choices?.[0]?.message?.content;

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
