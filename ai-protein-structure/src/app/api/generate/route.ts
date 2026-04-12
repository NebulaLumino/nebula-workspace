import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.deepseek.com/v1",
});

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();
    if (!input?.trim()) {
      return NextResponse.json({ error: "Input required." }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert protein structure analyst. Given a protein sequence or description, provide:
1. Putative secondary structure prediction (alpha-helices, beta-strands, coils)
2. Domain and motif identification
3. Potential functional annotations
4. Structural class prediction (globular, membrane, disordered)
5. Any notable features or concerns
Format your response with clear markdown headers. Be scientifically rigorous.`,
        },
        { role: "user", content: input },
      ],
      max_tokens: 1200,
      temperature: 0.7,
    });

    const output = completion.choices[0]?.message?.content || "No response generated.";
    return NextResponse.json({ output });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
