import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { description, mood, includeHashtags, includeEmoji, count } = await req.json();

    if (!description) {
      return NextResponse.json({ error: "Please describe your photo." }, { status: 400 });
    }

    const emojiInstruction = includeEmoji
      ? "Include relevant emojis scattered naturally throughout the caption."
      : "Do NOT use emojis — write pure text only.";

    const prompt = `You are an expert Instagram copywriter. Generate ${count || 5} engaging Instagram captions for this photo:

**Photo Description:** ${description}
**Mood:** ${mood || "Authentic and genuine"}
**Emoji:** ${emojiInstruction}
**Hashtags:** ${includeHashtags ? `Include ${count || 5} highly relevant, specific hashtags at the end.` : "Do NOT include hashtags."}
**Count:** ${count || 5}

Guidelines:
- First line must be a HOOK — something that stops the scroll (a question, bold statement, or intriguing opener)
- Keep captions conversational and relatable
- Use line breaks for readability (3-10 lines ideal)
- Match the mood: funny for fun photos, heartfelt for meaningful ones, etc.
- Instagram captions can be up to 2,200 characters, but aim for 150-500 chars for maximum engagement

Format as a numbered list. Return ONLY the captions, nothing else.`;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are an Instagram content expert with deep knowledge of what drives engagement. You write captions that start conversations, get saves, and grow followers.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.85,
      max_tokens: 1000,
    });

    const captions = completion.choices[0]?.message?.content;

    if (!captions) {
      return NextResponse.json({ error: "Failed to generate captions." }, { status: 500 });
    }

    return NextResponse.json({ captions });
  } catch (error: unknown) {
    console.error("Caption generation error:", error);
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
