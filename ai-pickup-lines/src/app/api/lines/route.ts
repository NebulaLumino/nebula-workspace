import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { personality, context, humorLevel, count } = await req.json();

    const humorInstruction =
      humorLevel === "cheesy"
        ? "Cheesy, corny, bold — the kind that makes people groan and laugh."
        : humorLevel === "clever"
        ? "Clever, witty, intelligent wordplay — impress without trying too hard."
        : humorLevel === "smooth"
        ? "Smooth, confident, understated — casual charm, no effort visible."
        : "Funny, self-deprecating, laugh-out-loud humor.";

    const contextInstruction = context
      ? `The person is in this context: ${context}`
      : "Any casual social context.";

    const prompt = `You are a charming, witty dating coach. Generate original, funny pickup lines.

**Personality vibe:** ${personality || "Confident and playful"}
**Context:** ${contextInstruction}
**Humor level:** ${humorInstruction}
**Count:** ${count || 15}

Generate ${count || 15} pickup lines that are:
- Original and creative — not the same 10 lines everyone has heard
- ${humorLevel === "smooth" ? "Confident and understated — casual, not try-hard" : "Funny and memorable"}
- Respectful and never creepy or inappropriate
- ${humorLevel === "cheesy" ? "Bold enough to be a little corny — that's the charm" : "Smart and witty"}
- Specific enough to feel personal, not copy-pasted

Format as a numbered list. Return ONLY the lines.`;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are a charming dating coach and comedy writer. Your pickup lines are funny, clever, and always respectful. You write lines people actually want to use.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.9,
      max_tokens: 800,
    });

    const lines = completion.choices[0]?.message?.content;

    if (!lines) {
      return NextResponse.json({ error: "Failed to generate lines." }, { status: 500 });
    }

    return NextResponse.json({ lines });
  } catch (error: unknown) {
    console.error("Lines generation error:", error);
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
