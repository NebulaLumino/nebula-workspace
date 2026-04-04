import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const { metrics, stage } = await req.json();
    if (!metrics?.trim()) {
      return NextResponse.json({ error: "Financial metrics are required" }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://api.deepseek.com/v1",
    });

    const stageStr = stage || "Seed";
    const prompt = `You are a startup valuation expert. Generate a comprehensive valuation analysis for the following startup.

Financial Metrics: ${metrics}
Funding Stage: ${stageStr}

Please generate:
1. **Valuation Summary** - Estimated valuation range with rationale
2. **Comparable Company Analysis** - Comparable valuations from similar companies at the same stage
3. **DCF Analysis** - Key assumptions and discounted cash flow valuation
4. **VC Method Analysis** - Pre-money and post-money valuation using VC sizing rules
5. **Key Value Drivers** - What factors most influence the valuation?
6. **Red Flags & Risks** - What might lower the valuation?
7. **Valuation Negotiation Tips** - How to justify a higher valuation in investor conversations

Format with clear headers. Be specific with numbers and benchmarks.`;

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are an expert startup valuation analyst and venture capital professional.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const result = completion.choices[0]?.message?.content || "No valuation generated.";
    return NextResponse.json({ result });
  } catch (err: unknown) {
    console.error("Generation error:", err);
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
