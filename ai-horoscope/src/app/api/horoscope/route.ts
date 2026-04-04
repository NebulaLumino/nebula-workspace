import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { sign, period, focus } = await req.json();

    if (!sign) {
      return NextResponse.json({ error: "Please select a zodiac sign." }, { status: 400 });
    }

    const periodText = period === "daily" ? "today" : period === "weekly" ? "this week" : "this month";

    const prompt = `You are a mystical astrologer with deep knowledge of the zodiac. Generate a personalized horoscope reading.

**Zodiac Sign:** ${sign}
**Period:** ${periodText}
**Focus Area:** ${focus || "All areas — love, career, health, and general energy"}

Write a mystical, engaging horoscope reading that includes:

1. **Overall Energy** — A brief atmospheric description of the cosmic energy
2. **Love & Relationships** — What the stars say about connections and emotions
3. **Career & Ambition** — Opportunities and challenges in professional life
4. **Health & Wellness** — A gentle note on physical and mental wellbeing
5. **Lucky Elements** — A lucky number, color, and affirmation for the period

Make it feel personal, mystical, and genuinely insightful — not generic fortune-cookie nonsense. The tone should be warm, wise, and a little magical.`;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are a mystical astrologer and spiritual guide. You write horoscopes that are warm, wise, poetic, and genuinely insightful — blending ancient astrology with modern wisdom.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.85,
      max_tokens: 1200,
    });

    const reading = completion.choices[0]?.message?.content;

    if (!reading) {
      return NextResponse.json({ error: "Failed to generate horoscope." }, { status: 500 });
    }

    return NextResponse.json({ reading, sign, period });
  } catch (error: unknown) {
    console.error("Horoscope generation error:", error);
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
