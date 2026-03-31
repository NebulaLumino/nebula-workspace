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
          content: `You are an expert startup lawyer and venture capital specialist. Generate a comprehensive, market-standard term sheet for a startup fundraising.\n\nInclude all standard sections:\n1. Investment Terms (amount, price per share/pre-money valuation, post-money)\n2. Liquidation Preference (1x, 1.5x, participating vs non-participating)\n3. Anti-Dilution (full ratchet, weighted average, none)\n4. Voting Rights\n5. Board Composition (board seats, observer rights)\n6. Investor Rights (pro-rata, information rights, board observer)\n7. Protective Provisions\n8. Founder Vesting & Leaver provisions\n9. Drag-Along / Tag-Along\n10. ESOP Pool (pre or post money)\n11. Key Conditions Precedent\n12. Terms to negotiate harder vs accept\n\nNote market standards for the round type. Include a brief "Founder Tips" section.\n\nDISCLAIMER: This is a draft template — must be reviewed by qualified legal counsel.`,
        },
        { role: "user", content: `Generate a term sheet:\n\n${input}` },
      ],
      temperature: 0.6,
      max_tokens: 3000,
    });

    const result = response.choices[0]?.message?.content || "No result generated.";
    return NextResponse.json({ result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Generation failed" }, { status: 500 });
  }
}
