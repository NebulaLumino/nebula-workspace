import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { genre, mood, theme, keywords, structure } = await req.json();

    if (!genre || !mood) {
      return NextResponse.json(
        { error: "Please provide at least a genre and mood." },
        { status: 400 }
      );
    }

    const structureHint =
      structure === "verses"
        ? "Use VERSE 1 → CHORUS → VERSE 2 → CHORUS → BRIDGE → OUTRO format."
        : structure === "free"
        ? "Use free verse / spoken word style — no strict structure."
        : "Use standard POP structure: INTRO → VERSE → PRE-CHORUS → CHORUS → VERSE → CHORUS → BRIDGE → OUTRO.";

    const prompt = `You are a professional songwriter and lyricist. Write original song lyrics based on:

**Genre:** ${genre}
**Mood/Emotion:** ${mood}
**Theme:** ${theme || "Open interpretation"}
**Keywords to include:** ${keywords || "None — be creative"}
**Structure:** ${structureHint}

Write creative, compelling lyrics with:
- Vivid imagery and metaphors
- Rhyming couplets or free verse as appropriate
- An emotionally engaging narrative
- Original, non-generic phrasing

Format with clear section labels: [VERSE 1], [CHORUS], [VERSE 2], [BRIDGE], etc.

Write at least 2 verses, 2 choruses, and a bridge.`;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are an award-winning songwriter with expertise in pop, rock, hip-hop, country, R&B, and indie genres. You write emotionally resonant, original lyrics.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.9,
      max_tokens: 1200,
    });

    const lyrics = completion.choices[0]?.message?.content;

    if (!lyrics) {
      return NextResponse.json({ error: "Failed to generate lyrics." }, { status: 500 });
    }

    return NextResponse.json({ lyrics });
  } catch (error: unknown) {
    console.error("Lyrics generation error:", error);
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
