import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const { update, version } = await req.json();
    if (!update?.trim()) {
      return NextResponse.json({ error: "Product update description is required" }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://api.deepseek.com/v1",
    });

    const verStr = version || "Unreleased";
    const prompt = `You are a product marketing specialist. Generate a changelog entry in Keep a Changelog format.

Product Update Description: ${update}
Version: ${verStr}

Please generate:
1. **Changelog Entry** in Keep a Changelog format:
   ## [Version] - YYYY-MM-DD
   ### Added - New features
   ### Changed - Changes in existing functionality
   ### Deprecated - Soon-to-be removed features
   ### Removed - Now removed features
   ### Fixed - Bug fixes
   ### Security - Vulnerability fixes
2. **User-Facing Release Notes** - Friendly announcement copy for blog/email
3. **Tweet-Sized Summary** - One punchy summary for social media
4. **Internal Announcement Notes** - What the team should know

Format in Keep a Changelog standard. Be specific about what changed.`;

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are an expert technical writer and product marketing specialist.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
      max_tokens: 2200,
    });

    const result = completion.choices[0]?.message?.content || "No changelog generated.";
    return NextResponse.json({ result });
  } catch (err: unknown) {
    console.error("Generation error:", err);
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
