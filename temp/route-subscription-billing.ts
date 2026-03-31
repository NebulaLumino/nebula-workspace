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
          content: `You are an expert SaaS Pricing and Subscription Analyst. Analyze the provided billing data and deliver comprehensive pricing recommendations.\n\nProvide:\n1. Plan structure recommendations (how many tiers, pricing points)\n2. Feature gating suggestions per tier\n3. Discount strategy and impact analysis\n4. Churn reduction recommendations by segment\n5. MRR growth roadmap\n6. Warning signs in the current data\n\nFormat with clear sections and a recommended pricing table.`,
        },
        { role: "user", content: `Analyze this subscription billing data:\n\n${input}` },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const result = response.choices[0]?.message?.content || "No result generated.";
    return NextResponse.json({ result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Generation failed" }, { status: 500 });
  }
}
