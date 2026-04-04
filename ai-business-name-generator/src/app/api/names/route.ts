import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

const INDUSTRIES = [
  "Tech / SaaS",
  "E-commerce / Retail",
  "Health & Wellness",
  "Food & Beverage",
  "Finance / FinTech",
  "Education / EdTech",
  "Creative / Design",
  "Real Estate",
  "Travel / Hospitality",
  "Fitness / Sports",
  "Beauty / Fashion",
  "Entertainment / Media",
  "Professional Services",
  "Non-profit / Social Impact",
  "Other",
];

export async function POST(req: NextRequest) {
  try {
    const { industry, keywords, vibe, count } = await req.json();

    if (!industry) {
      return NextResponse.json(
        { error: "Please select an industry." },
        { status: 400 }
      );
    }

    const prompt = `You are an expert brand strategist and naming consultant. Generate creative, memorable business names for:

**Industry:** ${industry}
**Keywords/Values:** ${keywords || "Modern, professional, innovative"}
**Vibe/Style:** ${vibe || "Professional and memorable"}
**Number of names:** ${count || 10}

Generate ${count || 10} unique business names. For each, provide:
1. The business name
2. A tagline (optional)
3. Brief explanation of why it works

Format as a numbered list. Be creative — use wordplay, portmanteaus, metaphors, and modern naming conventions where appropriate. Avoid generic names.

Return ONLY the names, no preamble.`;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are a world-class brand strategist with expertise in naming startups, products, and services. You create memorable, distinctive, brandable names.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.9,
      max_tokens: 1200,
    });

    const names = completion.choices[0]?.message?.content;

    if (!names) {
      return NextResponse.json({ error: "Failed to generate names." }, { status: 500 });
    }

    return NextResponse.json({ names, industries: INDUSTRIES });
  } catch (error: unknown) {
    console.error("Name generation error:", error);
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
