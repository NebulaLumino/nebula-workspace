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
          content: `You are an expert Marketing Mix Optimization Analyst. Analyze the provided marketing spend and revenue data, then recommend an optimized budget allocation across channels.\n\nFor each channel, provide:\n1. Current allocation % and spend\n2. Recommended allocation % and spend  \n3. Expected ROI impact\n4. Key rationale\n\nAlso provide:\n- Total projected revenue improvement\n- Priority channels to scale\n- Channels to reduce or eliminate\n- Quarterly rebalancing advice\n\nFormat output with clear sections and a summary table. Be specific with numbers.`,
        },
        {
          role: "user",
          content: `Analyze this marketing data and provide an optimized mix:\n\n${input}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const result = response.choices[0]?.message?.content || "No result generated.";
    return NextResponse.json({ result });
  } catch (error: any) {
    console.error("Generation error:", error);
    return NextResponse.json({ error: error.message || "Generation failed" }, { status: 500 });
  }
}
