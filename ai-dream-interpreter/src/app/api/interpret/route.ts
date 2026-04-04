import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { dream, context } = await req.json();

    if (!dream) {
      return NextResponse.json({ error: "Please describe your dream." }, { status: 400 });
    }

    const prompt = `You are a skilled dream analyst and psychologist, blending Jungian symbolism with modern psychological interpretation.

**Dream Description:**
${dream}

**Personal Context (optional):**
${context || "No additional context provided — focus on universal dream symbolism."}

Interpret this dream using a layered approach:

1. **Immediate Feeling** — The emotional tone of the dream and its significance
2. **Symbol Breakdown** — Identify the key symbols, figures, and events and their psychological/spiritual meanings
3. **Personal Connections** — Possible personal meanings based on the dreamer's life
4. **Shadow & Subconscious** — What the subconscious may be communicating
5. **Integration & Guidance** — A thoughtful, actionable insight or question for the dreamer to reflect on

Be warm, insightful, and thoughtful — dreams are deeply personal, so your interpretation should feel empathetic, not clinical or prescriptive.`;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are a wise dream analyst drawing from Jungian psychology, mythology, and modern psychotherapy. Your interpretations are poetic, insightful, and deeply empathetic.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.85,
      max_tokens: 1200,
    });

    const interpretation = completion.choices[0]?.message?.content;

    if (!interpretation) {
      return NextResponse.json({ error: "Failed to interpret dream." }, { status: 500 });
    }

    return NextResponse.json({ interpretation });
  } catch (error: unknown) {
    console.error("Dream interpretation error:", error);
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
