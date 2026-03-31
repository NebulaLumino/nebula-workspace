import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();
    if (!input?.trim()) {
      return NextResponse.json({ error: "Input is required" }, { status: 400 });
    }

    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert Franchise Business consultant. Generate a comprehensive franchise business plan.\n\nInclude:\n1. Executive Summary\n2. Business Concept & Value Proposition\n3. Market Analysis (size, trends, target customer)\n4. Unit Economics:\n   - Estimated startup cost breakdown\n   - Revenue model and pricing\n   - Monthly operating expenses\n   - Break-even timeline\n   - Projected ROI per unit (Year 1, 2, 3)\n   - Franchisee ROI analysis\n5. Franchisee Support & Training Plan\n6. Brand Standards Overview\n7. Operations Manual Outline\n8. Marketing & Launch Plan\n9. Competitive Differentiation\n10. Risk Analysis\n\nUse industry benchmarks for franchise economics. Be specific with numbers.`,
        },
        { role: "user", content: `Generate franchise business plan:\n\n${input}` },
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const result = response.choices[0]?.message?.content || "No result generated.";
    return NextResponse.json({ result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Generation failed" }, { status: 500 });
  }
}
