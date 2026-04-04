import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const { market, competitors } = await req.json();
    if (!market?.trim()) {
      return NextResponse.json({ error: "Market description is required" }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://api.deepseek.com/v1",
    });

    const compStr = competitors || "not specified";
    const prompt = `You are a competitive strategy analyst. Generate a comprehensive competitive landscape analysis for the following market and competitors.

Market: ${market}
Competitors: ${compStr}

Please generate:
1. **Competitive Landscape Overview** - Describe the current market landscape
2. **Competitor SWOT Analysis** - SWOT for each named competitor
3. **Market Positioning Map** - Describe how competitors are positioned relative to each other on key dimensions
4. **Competitive Moat Opportunities** - Where can your startup build defensible advantages?
5. **White Space Opportunities** - Underserved segments, unmet needs, or positioning gaps
6. **Key Competitive Threats** - What threats do existing players pose?
7. **Recommended Go-to-Market Differentiators** - How should the startup differentiate?

Format with clear headers. Be specific and analytical.`;

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are an expert competitive strategy analyst and market researcher.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const result = completion.choices[0]?.message?.content || "No analysis generated.";
    return NextResponse.json({ result });
  } catch (err: unknown) {
    console.error("Generation error:", err);
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
