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
          content: `You are an expert Customer Experience and Market Research analyst. Analyze the NPS survey responses and deliver actionable insights.\n\nFor the data provided, calculate and report:\n1. NPS Score (Promoters 9-10, Passives 7-8, Detractors 0-6)\n2. Score breakdown summary\n3. Theme analysis — what topics/themes come up repeatedly\n4. Sentiment breakdown (positive, negative, neutral)\n5. Top verbatim quotes segmented by:\n   - Promoters (what they love)\n   - Passives (what keeps them neutral)\n   - Detractors (what frustrates them)\n6. Actionable recommendations by customer segment\n7. Priority fixes (quick wins from detractor feedback)\n8. Retention plays (from promoter feedback)\n\nFormat clearly with sections and quotes.`,
        },
        { role: "user", content: `Analyze these NPS responses:\n\n${input}` },
      ],
      temperature: 0.6,
      max_tokens: 2500,
    });

    const result = response.choices[0]?.message?.content || "No result generated.";
    return NextResponse.json({ result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Generation failed" }, { status: 500 });
  }
}
