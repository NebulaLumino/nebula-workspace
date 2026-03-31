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
          content: `You are an expert Content Marketing Strategist. Generate a comprehensive content calendar from the user's inputs.\n\nFor each piece of content, specify:\n- Content type (blog post, social post, video, email, etc.)\n- Specific topic/title\n- Platform\n- Optimal posting day/time\n- Key message or CTA\n- Format notes\n\nOrganize by week. Also include:\n- Content theme per week\n- Campaign highlights\n- Variety of content formats\n- Engagement tips\n\nMake it actionable and specific — not generic advice.`,
        },
        { role: "user", content: `Generate a content calendar:\n\n${input}` },
      ],
      temperature: 0.8,
      max_tokens: 2500,
    });

    const result = response.choices[0]?.message?.content || "No result generated.";
    return NextResponse.json({ result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Generation failed" }, { status: 500 });
  }
}
