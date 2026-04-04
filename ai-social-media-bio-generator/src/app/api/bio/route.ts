import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { platform, profession, personality, audience, count } = await req.json();

    if (!profession) {
      return NextResponse.json({ error: "Please provide your profession/title." }, { status: 400 });
    }

    const platformLimits: Record<string, string> = {
      twitter: "160 characters",
      instagram: "150 characters",
      linkedin: "220 characters",
      threads: "160 characters",
      tiktok: "80 characters",
      youtube: "500 characters",
      bio: "200 characters",
    };

    const limit = platformLimits[platform || "bio"] || "200 characters";

    const prompt = `You are an expert social media copywriter. Generate ${count || 5} creative, engaging social media bios.

**Platform:** ${platform || "General"}
**Character Limit:** ${limit}
**Profession/Title:** ${profession}
**Personality:** ${personality || "Creative, ambitious, professional"}
**Target Audience:** ${audience || "General professional audience"}
**Count:** ${count || 5}

Guidelines:
- Each bio must fit within the ${limit} character limit for ${platform || "this platform"}
- Use strong verbs and power words
- Show personality without being unprofessional
- Include relevant keywords naturally
- Mix approaches: some fun, some professional, some quirky
- Include 1-2 relevant emojis where appropriate (not excessive)

Format as a numbered list with the character count next to each bio. Return ONLY the bios.`;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are a social media expert and personal brand strategist. You write punchy, memorable bios that capture attention and communicate value instantly.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.85,
      max_tokens: 800,
    });

    const bios = completion.choices[0]?.message?.content;

    if (!bios) {
      return NextResponse.json({ error: "Failed to generate bios." }, { status: 500 });
    }

    return NextResponse.json({ bios });
  } catch (error: unknown) {
    console.error("Bio generation error:", error);
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
