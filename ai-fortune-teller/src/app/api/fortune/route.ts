import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { fortuneType, question } = await req.json();

    const types: Record<string, { title: string; prompt: string }> = {
      general: {
        title: "General Fortune",
        prompt: "Give a broad, mystical reading about the overall direction and energy of the querent's life right now.",
      },
      love: {
        title: "Love Reading",
        prompt: "Provide a romantic fortune focusing on relationships, connection, and matters of the heart.",
      },
      career: {
        title: "Career Fortune",
        prompt: "Reveal insights about professional path, ambition, and work-related decisions.",
      },
      secret: {
        title: "The Secret",
        prompt: "Reveal a hidden truth or message that the universe is trying to communicate.",
      },
    };

    const config = types[fortuneType] || types.general;

    const prompt = `You are a mystical fortune teller with ancient wisdom. You channel cosmic energy to reveal truths.

**Fortune Type:** ${config.title}
${question ? `**The Seeker Asks:** ${question}` : ""}

${config.prompt}

Channel your mystical wisdom to deliver a fortune that includes:

1. **The Cosmic Message** — A main insight or revelation, framed mystically
2. **Hidden Symbolism** — What the cards / stars / cosmos are communicating
3. **The Path Ahead** — A prediction or direction for what comes next
4. **A Ritual or Affirmation** — Something the seeker should do to align with positive energy

Be poetic, mysterious, warm, and wise. Use phrases like "the stars reveal...", "a hidden truth emerges...", "the cosmos speak...". Make the seeker feel seen and guided.`;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are a mystical oracle and fortune teller with ancient wisdom. Your readings are poetic, warm, mysterious, and deeply insightful. You speak like a wise oracle who has seen across time.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.9,
      max_tokens: 1200,
    });

    const fortune = completion.choices[0]?.message?.content;

    if (!fortune) {
      return NextResponse.json({ error: "Failed to divine your fortune." }, { status: 500 });
    }

    return NextResponse.json({ fortune, title: config.title });
  } catch (error: unknown) {
    console.error("Fortune generation error:", error);
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
