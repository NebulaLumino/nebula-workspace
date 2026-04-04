import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { product, features, audience, tone, format, seo } = await req.json();

    if (!product) {
      return NextResponse.json({ error: "Please provide a product name." }, { status: 400 });
    }

    const toneInstruction =
      tone === "fun"
        ? "Write in a fun, playful, conversational tone with personality."
        : tone === "luxury"
        ? "Write in an elegant, premium, sophisticated tone."
        : tone === "urgent"
        ? "Write in a compelling, urgency-driven, persuasive tone."
        : "Write in a professional, trustworthy, clear tone.";

    const seoInstruction = seo
      ? "Include a short SEO meta description at the end prefixed with 'SEO: '."
      : "";

    const formatInstruction =
      format === "short"
        ? "Keep the description SHORT — 2-3 sentences max, punchy and to the point."
        : format === "detailed"
        ? "Write a DETAILED description with 3-4 paragraphs covering features, benefits, and use cases."
        : "Write a MODERATE description — 1-2 paragraphs, clear and engaging.";

    const prompt = `You are an expert e-commerce copywriter. Generate compelling product descriptions.

**Product:** ${product}
**Key Features:** ${features || "Highlight the most important features"}
**Target Audience:** ${audience || "General consumers"}
**Tone:** ${toneInstruction}
**Format:** ${formatInstruction}
${seoInstruction}

Write a description that:
- Captures attention immediately
- Highlights key benefits, not just features
- Speaks directly to the target audience
- Creates desire and urgency
- Includes a clear call-to-action

Return ONLY the description(s), no headers or labels. If generating multiple tones, separate with "---" and label each.`;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are a conversion-focused e-commerce copywriter. You write descriptions that sell — clear, persuasive, and customer-centric.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 1000,
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
