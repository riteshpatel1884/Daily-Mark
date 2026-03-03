// app/api/analyze/route.js
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req) {
  try {
    const { message, context, history } = await req.json();

    // ── DSA Core Stats ─────────────────────────────────────────────────────
    const dsaScore = context?.dsa?.score ?? 0;
    const dsaSolved = context?.dsa?.solved ?? 0;
    const dsaTotal = context?.dsa?.total ?? 0;

    // ── Pace Status ────────────────────────────────────────────────────────
    let paceStatus = "No deadline set";
    if (context?.pace) {
      const { lateDays, requiredPerDay, actualPerDay, daysLeft, remaining } =
        context.pace;
      if (lateDays === Infinity || actualPerDay === 0) {
        paceStatus = `No activity logged yet — ${daysLeft}d left, ${remaining} questions remaining`;
      } else if (lateDays > 5) {
        paceStatus = `${Math.round(lateDays)} days BEHIND schedule — needs ${requiredPerDay?.toFixed(1)} q/day but averaging ${actualPerDay?.toFixed(1)} q/day`;
      } else if (lateDays < -3) {
        paceStatus = `${Math.abs(Math.round(lateDays))} days AHEAD of schedule — doing ${actualPerDay?.toFixed(1)} q/day, need ${requiredPerDay?.toFixed(1)} q/day`;
      } else {
        paceStatus = `Barely on pace — ${actualPerDay?.toFixed(1)} q/day actual vs ${requiredPerDay?.toFixed(1)} q/day required, ${daysLeft}d left`;
      }
    }

    // ── Weak Topics with Retention + OA Risk ──────────────────────────────
    const weakTopics = context?.dsa?.weakTopics ?? [];

    const weakList =
      weakTopics.length > 0
        ? weakTopics.map((t) => t.label).join(", ")
        : "None identified";

    const retentionData =
      weakTopics.length > 0
        ? weakTopics
            .map(
              (t) =>
                `${t.label} → retention: ${t.retention ?? "?"}%, OA risk: ${t.oaRisk ?? "?"}, risk score: ${t.riskScore ?? "?"}/100, done: ${t.done ?? 0}/${t.total ?? "?"}`,
            )
            .join(" | ")
        : "No retention data yet";

    const highRiskTopics =
      weakTopics
        .filter((t) => t.oaRisk === "HIGH")
        .map((t) => t.label)
        .join(", ") || "None";

    const urgentRetention =
      weakTopics
        .filter((t) => (t.retention ?? 100) < 40)
        .map((t) => `${t.label} (${t.retention}%)`)
        .join(", ") || "None";

    // ── Opportunity Cost ───────────────────────────────────────────────────
    let oppCostSummary = "No activity data yet";
    if (context?.oppCost) {
      const { totalHoursSpent, untouched, willMiss, qPerDay } = context.oppCost;
      const untouchedNames =
        untouched?.map((t) => t.label).join(", ") || "None";
      oppCostSummary = [
        `~${Number(totalHoursSpent ?? 0).toFixed(0)}h total estimated prep time logged`,
        `Current pace: ${Number(qPerDay ?? 0).toFixed(1)} q/day`,
        `Projected questions missed by deadline: ~${Math.max(0, Math.round(willMiss ?? 0))}`,
        `Completely untouched patterns (${untouched?.length ?? 0}): ${untouchedNames}`,
      ].join(" · ");
    }

    // ── Real Readiness Score ───────────────────────────────────────────────
    let readinessSummary = "Not calculated yet";
    if (context?.readiness) {
      const { coverageScore, retentionScore, stabilityScore, combined } =
        context.readiness;
      readinessSummary = `Combined: ${combined}% | Coverage: ${coverageScore}% | Memory Retention: ${retentionScore}% | Interview Stability: ${stabilityScore}%`;
    }

    // ── Other Prep Areas ───────────────────────────────────────────────────
    const corePct = context?.core?.pct ?? 0;
    const resumePct = context?.resume?.pct ?? 0;
    const skillPct = context?.skills?.pct ?? 0;
    const targetCompany = context?.targetCompany ?? "product-based";
    const daysLeft = context?.pace?.daysLeft ?? "unknown";
    const remaining = context?.pace?.remaining ?? "unknown";

    // ── System Prompt ──────────────────────────────────────────────────────
    const systemPrompt = `You are the placement intelligence engine embedded inside a CS student's live prep dashboard. You are not a generic AI assistant — you are a razor-sharp strategic coach with real-time access to the student's actual preparation data. Every response must be derived entirely from the numbers below.

═══════════════════════════════════════════
LIVE STUDENT PREP DATA — ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
═══════════════════════════════════════════

DSA PROGRESS:
- Overall DSA Score: ${dsaScore}% complete
- Questions: ${dsaSolved}/${dsaTotal} solved

PACE STATUS:
- ${paceStatus}
- Days to target: ${daysLeft}
- Questions remaining: ${remaining}

REAL READINESS SCORE (3-factor model):
- ${readinessSummary}

PATTERN RETENTION & OA RISK (Ebbinghaus decay model):
- ${retentionData}
- HIGH OA Risk patterns: ${highRiskTopics}
- Critical retention decay (< 40%): ${urgentRetention}

OPPORTUNITY COST ANALYSIS:
- ${oppCostSummary}

OTHER PREP AREAS:
- Core CS Subjects: ${corePct}% revised
- Resume Health: ${resumePct}%
- Skill Proficiency: ${skillPct}%

TARGET: ${targetCompany} roles
═══════════════════════════════════════════

STRICT RESPONSE RULES — NEVER VIOLATE:
1. Zero markdown headers (no ##, ###, ---). Zero dash bullet lists.
2. Use bold inline labels only: e.g. "Risk:" "Focus:" "Today:" "Gap:" "Action:"
3. Tone: senior engineer giving a private briefing. Sharp. Zero fluff. Zero filler.
4. You MUST reference at least 2 specific numbers from the live data above in every response.
5. Maximum 180 words. Make every word count.
6. Always use "You" — never "I" or "As an AI".
7. Close every single response with exactly ONE specific immediate action the student should take right now.
8. Sections separated by a single blank line only. Max 4–5 visual blocks.
9. If pace is bad, say it bluntly with numbers. If pace is good, acknowledge briefly then raise the bar.
10. Zero generic advice. If it could apply to any student, rewrite it using their specific numbers.
11. Never repeat the same advice across messages in a conversation.
12. If asked about OA risk, always mention HIGH-risk patterns by name.
13. If asked about retention, always give specific % numbers for the worst topics.
14. If asked about opportunity cost, call out the untouched patterns and projected miss by name.`;

    // ── Build Message History ──────────────────────────────────────────────
    const messages = [
      {
        role: "system",
        content: systemPrompt,
      },
      // Include last 8 messages from chat history for context
      ...(history ?? [])
        .slice(-8)
        .filter((m) => m?.content?.trim())
        .map((m) => ({
          role:
            m.role === "ai" || m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        })),
      {
        role: "user",
        content: message,
      },
    ];

    // ── Create Streaming Completion via Groq ───────────────────────────────
    const stream = await groq.chat.completions.create({
      messages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.6,
      max_tokens: 600,
      stream: true,
    });

    // ── Stream SSE Response ────────────────────────────────────────────────
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
          console.error("Stream error:", err);
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no", // prevents nginx from buffering SSE
      },
    });
  } catch (error) {
    console.error("AI Coach Error:", error);
    return new Response(
      JSON.stringify({ error: "Coach is offline. Check GROQ_API_KEY." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
