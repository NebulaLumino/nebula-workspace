import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { title, keyPoints, seoKeywords, includeTimestamps, style } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Please provide your video title." }, { status: 400 });
    }

    const timestampInstruction = includeTimestamps
      ? `Include 3-5 suggested timestamps formatted as "0:00 - Section Title" at appropriate points.`
      : "Do not include timestamps.";

    const styleInstruction =
      style === "fun"
        ? "Use a fun, energetic, engaging tone throughout."
        : style === "professional"
        ? "Use a professional, authoritative, educational tone throughout."
        : "Use a friendly, conversational, relatable tone throughout.";

    const prompt = `You are a YouTube content strategist and SEO expert. Generate a complete YouTube video description.

**Video Title:** ${title}
**Key Points to Cover:** ${keyPoints || "Main topics in the video"}
**SEO Keywords:** ${seoKeywords || "Relevant keywords for discoverability"}
**Timestamps:** ${timestampInstruction}
**Tone:** ${styleInstruction}

Generate a description that includes:

1. **Opening hook** (2-3 lines) — Grab attention and explain what viewers will learn or get
2. **Body sections** — Organized by key points with the timestamps if included
3. **Call-to-action** — Like, subscribe, comment, and link to relevant resources
4. **SEO-optimized paragraph** — 2-3 sentences with primary keywords for search

YouTube descriptions can be up to 5,000 characters. Generate 400-800 characters of quality content.

Format cleanly. Return ONLY the description.`;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are a YouTube growth expert and SEO specialist. You write descriptions that rank in search and hook viewers immediately.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.75,
      max_tokens: 1200,
    });

    const description = completion.choices[0]?.message?.content;

    if (!description) {
      return NextResponse.json({ error: "Failed to generate description." }, { status: 500 });
    }

    return NextResponse.json({ description });
  } catch (error: unknown) {
    console.error("Description generation error:", error);
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
