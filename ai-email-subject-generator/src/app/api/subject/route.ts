import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { purpose, audience, tone, count } = await req.json();

    if (!purpose) {
      return NextResponse.json({ error: "Please provide the email purpose." }, { status: 400 });
    }

    const toneInstruction =
      tone === "urgent"
        ? "Use urgent, time-sensitive language that creates FOMO and drives immediate action."
        : tone === "friendly"
        ? "Use warm, conversational, friendly language that feels personal and approachable."
        : tone === "formal"
        ? "Use professional, polished, formal language appropriate for business communication."
        : "Use curiosity-driven language that makes the reader curious and eager to open.";

    const prompt = `You are an expert email marketer and copywriter. Generate ${count || 8} high-converting email subject lines.

**Email Purpose:** ${purpose}
**Target Audience:** ${audience || "General recipients"}
**Tone:** ${toneInstruction}
**Count:** ${count || 8}

Rules for great email subject lines:
- Under 60 characters (ideal for mobile)
- Create curiosity, urgency, or value — never mislead
- Use power words: exclusive, new, proven, secret, limited, you, free, today
- Vary the approaches: questions, statements, numbers, personalization
- Avoid spam triggers: !!, all caps, "free money", excessive punctuation

Format as a numbered list. Return ONLY the subject lines, nothing else.`;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are an email marketing expert with 15+ years of experience. You write subject lines with 40-60% open rates. Every word earns its place.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.85,
      max_tokens: 800,
    });

    const subjects = completion.choices[0]?.message?.content;

    if (!subjects) {
      return NextResponse.json({ error: "Failed to generate subject lines." }, { status: 500 });
    }

    return NextResponse.json({ subjects });
  } catch (error: unknown) {
    console.error("Subject line generation error:", error);
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
