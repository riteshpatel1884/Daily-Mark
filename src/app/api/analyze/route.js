// app/api/analyze/route.js
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req) {
  try {
    const { message, context, history } = await req.json();

    const weakList =
      context.dsa.weakTopics?.map((t) => t.label).join(", ") || "None";
    const staleList =
      context.dsa.weakTopics
        ?.filter((t) => t.isStale)
        .map((t) => `${t.label} (${t.daysSince}d untouched)`)
        .join(", ") || "None";

    const paceStatus = context.pace
      ? context.pace.lateDays > 5
        ? `${Math.round(context.pace.lateDays)} days behind — needs ${context.pace.requiredPerDay?.toFixed(1)} q/day but averaging ${context.pace.actualPerDay?.toFixed(1)}`
        : context.pace.lateDays < -3
          ? `${Math.abs(Math.round(context.pace.lateDays))} days ahead of schedule`
          : "barely on pace"
      : "no deadline set";

    const systemPrompt = `You are the placement intelligence engine inside a student's prep dashboard. You have full access to their real-time progress. You are not an AI assistant — you are a core analytical feature that gives strategic intelligence no other prep platform offers.

LIVE STUDENT DATA:
- DSA Progress: ${context.dsa.score}% complete (${context.dsa.solved}/${context.dsa.total} questions solved)
- Pace Status: ${paceStatus}
- Weak patterns needing attention: ${weakList}
- Stale patterns not opened recently: ${staleList}
- Core CS: ${context.core?.pct ?? 0}% revised
- Resume Health: ${context.resume?.pct ?? 0}%
- Skill Proficiency: ${context.skills?.pct ?? 0}%
- Days to target: ${context.pace?.daysLeft ?? "not set"}
- Questions remaining: ${context.pace?.remaining ?? "unknown"}

RESPONSE RULES — STRICT:
1. Never use ## or ### headings. Never use --- dividers. Never use bullet points with dashes.
2. Bold short labels inline: e.g. "Focus area:" or "Risk:" or "Today's target:"
3. Tone: sharp mentor, private briefing, zero fluff. Like a senior engineer coaching a junior.
4. Always reference at least 2 specific numbers from the student's live data.
5. Max 150 words. Dense and actionable.
6. Never say "I" or "As an AI". Always use "You" and "Your".
7. Zero generic advice. Everything derived from actual numbers above.
8. Separate sections with a blank line. Max 4–5 visual lines.
9. Be blunt about bad pace. Acknowledge good pace briefly, then raise the bar.
10. Close every response with exactly one specific immediate action.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(history || []).slice(-8).map((m) => ({
        role: m.role === "ai" ? "assistant" : m.role,
        content: m.content,
      })),
      { role: "user", content: message },
    ];

    // Create a streaming completion
    const stream = await groq.chat.completions.create({
      messages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.65,
      max_tokens: 500,
      stream: true,
    });

    // Return a ReadableStream (SSE-style)
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const token = chunk.choices[0]?.delta?.content || "";
            if (token) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ token })}\n\n`),
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("AI Error:", error);
    return new Response(JSON.stringify({ error: "Coach is offline." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
