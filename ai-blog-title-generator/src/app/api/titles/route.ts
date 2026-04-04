import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { topic, audience, style, count } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Please provide a blog topic." }, { status: 400 });
    }

    const styleInstruction =
      style === "listicle"
        ? "Write listicle-style titles with numbers (e.g., '10 Ways to...', '7 Tips for...')"
        : style === "howto"
        ? "Write 'How to...' instructional titles"
        : style === "question"
        ? "Write question-format titles that provoke curiosity"
        : "Mix it up: include listicles, how-tos, questions, and statement titles";

    const prompt = `You are an expert blog content strategist. Generate click-worthy blog post titles.

**Topic:** ${topic}
**Target Audience:** ${audience || "General readers"}
**Title Style:** ${styleInstruction}
**Count:** ${count || 12}

Rules for irresistible blog titles:
- Max 60 characters (for SEO and social sharing)
- Create curiosity or promise a specific benefit
- Use power words: proven, ultimate, essential, surprising, effortless, etc.
- Numbers work well (odd numbers especially: 5, 7, 9, 13...)
- Questions work well when they challenge assumptions
- Avoid clickbait that misleads — titles must deliver

Generate ${count || 12} varied titles across different angles of the topic.

Format as a numbered list. Return ONLY the titles, no labels or preamble.`;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are a viral content strategist. You write blog titles that get clicks without being misleading. Your titles balance curiosity with honest value delivery.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.85,
      max_tokens: 800,
    });

    const titles = completion.choices[0]?.message?.content;

    if (!titles) {
      return NextResponse.json({ error: "Failed to generate titles." }, { status: 500 });
    }

    return NextResponse.json({ titles });
  } catch (error: unknown) {
    console.error("Title generation error:", error);
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
