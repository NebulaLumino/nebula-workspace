import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { theme, mood, style, count } = await req.json();

    if (!theme) {
      return NextResponse.json({ error: "Please provide a theme or topic." }, { status: 400 });
    }

    const styleInstruction =
      style === "haiku"
        ? "Write a traditional 3-line haiku with a 5-7-5 syllable structure."
        : style === "sonnet"
        ? "Write a 14-line Shakespearean sonnet with an ABAB CDCD EFEF GG rhyme scheme."
        : style === "limerick"
        ? "Write a playful 5-line limerick with an AABBA rhyme scheme."
        : style === "free"
        ? "Write free verse poetry — no rhyme or meter, but rich imagery and rhythm."
        : "Write a romantic ballad-style poem with verses and a chorus/hook section.";

    const prompt = `You are a poet and creative writer. Write original poetry.

**Theme:** ${theme}
**Mood/Emotion:** ${mood || "Contemplative and evocative"}
**Poetic Form:** ${styleInstruction}
**Variations:** ${count || 2}

Write ${count || 2} distinct poems exploring the theme from different angles.

Guidelines:
- Use vivid, precise imagery — show, don't tell
- Engage all senses where appropriate
- Let emotion come through in word choice and rhythm
- Avoid clichés and generic phrasing
- Each poem should be 4-20 lines

Format each poem with a title and clear section breaks. Separate poems with "---". Return ONLY the poems.`;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are a celebrated poet with mastery across classical and contemporary forms. Your poetry is emotionally resonant, visually rich, and technically precise.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.95,
      max_tokens: 1200,
    });

    const poetry = completion.choices[0]?.message?.content;

    if (!poetry) {
      return NextResponse.json({ error: "Failed to generate poetry." }, { status: 500 });
    }

    return NextResponse.json({ poetry });
  } catch (error: unknown) {
    console.error("Poetry generation error:", error);
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
