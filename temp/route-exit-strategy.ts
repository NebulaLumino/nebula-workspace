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
          content: `You are an expert M&A advisor and business strategist specializing in exit planning. Generate a comprehensive exit strategy roadmap.\n\nProvide:\n1. Exit Path Analysis — pros/cons of each path for this business:\n   - Strategic Acquisition (by a larger company)\n   - Financial PE Buyout\n   - IPO (if applicable)\n   - Management Buyout (MBO)\n   - Secondary Sale\n\n2. For the most likely exit path:\n   - Target timeline\n   - Typical valuation multiples for this industry/stage\n   - Estimated valuation range\n\n3. Pre-Exit Preparation Checklist (12-24 months before exit)\n\n4. Key Milestones needed to maximize valuation\n\n5. Value Gap Analysis — what the business needs to achieve to reach target valuation\n\n6. Buyer Landscape — who would likely be interested and why\n\n7. Exit Readiness Scorecard\n\nBe specific with numbers based on the business profile provided.`,
        },
        { role: "user", content: `Generate exit strategy:\n\n${input}` },
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
