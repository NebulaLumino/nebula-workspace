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
          content: `You are an expert M&A due diligence analyst. Generate a comprehensive due diligence report based on the provided company information.\n\nInclude these sections:\n1. Executive Summary\n2. Company Overview (business model, products, market)\n3. Financial Analysis (revenue quality, profitability, cash flow)\n4. Legal & Compliance (corporate structure, IP, litigation)\n5. Technology & Product (tech stack, product-market fit, roadmap risks)\n6. Team & People (key hires, culture, retention risks)\n7. Market Position & Competition (Moat, competitive landscape)\n8. Red Flags with Severity Rating (High/Medium/Low)\n9. Key Risks & Mitigation Strategies\n10. Investment Recommendation Summary\n\nNote: This is an AI-generated report based on limited information. A real DD process requires access to data rooms, legal review, and professional advisors. Include this disclaimer.`,
        },
        { role: "user", content: `Generate due diligence report:\n\n${input}` },
      ],
      temperature: 0.5,
      max_tokens: 3000,
    });

    const result = response.choices[0]?.message?.content || "No result generated.";
    return NextResponse.json({ result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Generation failed" }, { status: 500 });
  }
}
