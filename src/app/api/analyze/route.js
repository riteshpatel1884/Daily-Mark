// app/api/analyze/route.js
import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req) {
  try {
    const { message, context, history } = await req.json();

    // Construct the system prompt with the user's live data
    const systemPrompt = `
      You are a specialized FAANG Placement Coach. You are strict, data-driven, but encouraging.
      
      CURRENT STUDENT DATA:
      - DSA Score: ${context.dsa.score}% (${context.dsa.solved}/${context.dsa.total} solved)
      - Weak Patterns: ${context.dsa.weakTopics.map((t) => t.label).join(", ") || "None currently"}
      - Pace: ${context.pace?.lateDays > 0 ? `${context.pace.lateDays} days behind` : "On track"}
      - Resume Health: ${context.resume.pct}%
      - Target Date: ${context.pace?.projectedDate || "Not set"}

      INSTRUCTIONS:
      1. Answer the user's question specifically using the data above.
      2. If they ask for a plan, prioritize their "Weak Patterns".
      3. Keep answers concise (under 150 words) and formatted in Markdown.
      4. Do not be generic. If they are behind pace, tell them to hurry up.
    `;

    // Combine history for context (limit last 6 messages to save tokens)
    const messages = [
      { role: "system", content: systemPrompt },
      ...(history || []).slice(-6),
      { role: "user", content: message },
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 450,
    });

    return NextResponse.json({
      reply: chatCompletion.choices[0]?.message?.content,
    });
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "Coach is offline." }, { status: 500 });
  }
}
