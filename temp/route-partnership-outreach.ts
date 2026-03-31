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
          content: `You are an expert Business Development and Partnership strategist. Analyze the partnership opportunity and provide comprehensive recommendations.\n\nProvide:\n1. Partnership scoring model (1-10) across dimensions:\n   - Audience overlap\n   - Revenue potential\n   - Strategic fit\n   - Operational complexity\n   - Brand alignment\n\n2. Expected revenue impact analysis\n\n3. Best partnership structures to propose\n\n4. Personalization suggestions for each partner (what specifically to highlight based on their audience/content)\n\n5. Outreach email/message templates (2-3 variants)\n\n6. Negotiation levers and deal-breakers\n\n7. Implementation timeline\n\nBe specific to the partners mentioned — not generic advice.`,
        },
        { role: "user", content: `Analyze partnership opportunity:\n\n${input}` },
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const result = response.choices[0]?.message?.content || "No result generated.";
    return NextResponse.json({ result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Generation failed" }, { status: 500 });
  }
}
