import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { niche, audience, contentType, count } = await req.json();

    if (!niche) {
      return NextResponse.json({ error: "Please provide a niche or topic." }, { status: 400 });
    }

    const prompt = `You are an SEO keyword strategist. Generate a comprehensive keyword research report.

**Niche/Topic:** ${niche}
**Target Audience:** ${audience || "General consumers"}
**Content Type:** ${contentType || "Blog / Website"}
**Number of keywords:** ${count || 20}

Generate a structured keyword list in these categories:

1. **Primary Keywords** (high volume, competitive) — ${Math.ceil((count || 20) / 4)} keywords
2. **Secondary Keywords** (medium volume, moderate competition) — ${Math.ceil((count || 20) / 4)} keywords  
3. **Long-tail Keywords** (low volume, low competition, high intent) — ${Math.ceil((count || 20) / 4)} keywords
4. **LSI Keywords** (semantically related terms) — ${Math.ceil((count || 20) / 4)} keywords

Format as:

**Primary Keywords:**
1. keyword (search intent: informational|transactional|navigational)

**Secondary Keywords:**
1. keyword (search intent)

...and so on for all 4 categories.

Be specific and realistic. Return ONLY the keyword list, no preamble.`;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are an SEO expert with 10+ years of experience in keyword research and content strategy. You generate realistic, actionable keyword lists.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const keywords = completion.choices[0]?.message?.content;

    if (!keywords) {
      return NextResponse.json({ error: "Failed to generate keywords." }, { status: 500 });
    }

    return NextResponse.json({ keywords });
  } catch (error: unknown) {
    console.error("Keywords generation error:", error);
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
