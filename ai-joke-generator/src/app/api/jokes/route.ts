import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { topic, style, clean, count } = await req.json();

    const cleanInstruction = clean
      ? "Keep all jokes completely family-friendly and appropriate for all ages."
      : "A mix is fine, but nothing offensive or mean-spirited.";

    const styleInstruction =
      style === "puns"
        ? "Focus on wordplay, puns, and clever double meanings."
        : style === "one liners"
        ? "Short, punchy one-liners that land in a single line."
        : style === " observational"
        ? "Observational humor about everyday situations."
        : "Mix of different joke types for variety.";

    const prompt = `You are a comedian and joke writer. Generate funny jokes.

**Topic (optional):** ${topic || "General / open topic"}
**Joke Style:** ${styleInstruction}
**Content:** ${cleanInstruction}
**Count:** ${count || 10}

Generate ${count || 10} jokes that are actually funny — not corny or forced.

Rules:
- Variety: mix the joke types where possible
- Punchlines should be unexpected but obvious in hindsight
- Avoid cliché jokes everyone has heard before
- Puns should be clever, not groan-worthy
- No offensive, racist, sexist, or mean-spirited content

Format as a numbered list with the joke type in brackets, e.g. "[Pun]". Return ONLY the jokes.`;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are a witty comedian who writes fresh, clever jokes. Your humor is smart, surprising, and genuinely funny — not forced or predictable.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.9,
      max_tokens: 800,
    });

    const jokes = completion.choices[0]?.message?.content;

    if (!jokes) {
      return NextResponse.json({ error: "Failed to generate jokes." }, { status: 500 });
    }

    return NextResponse.json({ jokes });
  } catch (error: unknown) {
    console.error("Joke generation error:", error);
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
