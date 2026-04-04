import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const SYSTEM_PROMPT = `You are an estate planning and inheritance specialist. Based on the user's assets and family situation, generate an estate planning overview with trust types, tax implications, and inheritance strategy recommendations. Format your response with clear markdown sections including: Asset Inventory, Estate Tax Analysis, Trust Types Recommendations (Revocable, Irrevocable, etc.), Beneficiary Strategy, Probate Avoidance, Tax Efficiency Strategies, and Priority Action Items.`;

function getClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://api.deepseek.com/v1",
  });
}

export async function POST(req: NextRequest) {
  try {
    const { assets, family, goals } = await req.json();

    if (!assets || !family) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = getClient();

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Assets and estate overview:\n${assets}\n\nFamily situation:\n${family}\n\nEstate planning goals: ${goals || "General estate planning"}`,
        },
      ],
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content || "No result generated.";
    return NextResponse.json({ result });
  } catch (err: any) {
    console.error("DeepSeek API error:", err?.message || err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}