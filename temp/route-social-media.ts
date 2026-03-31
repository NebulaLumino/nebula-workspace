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
          content: `You are an expert Crisis Communications specialist. Generate a comprehensive social media crisis response plan.\n\nProvide:\n1. Situation Assessment — what's the severity, reach, and trajectory\n2. Response Strategy — tone, approach, key messages\n3. Escalation Decision Tree — when to escalate, who to call\n4. Approved Messaging Templates:\n   - Initial acknowledgment (first 30 min)\n   - Official statement (1-2 hours)\n   - Platform-specific responses (Twitter, Instagram, LinkedIn)\n   - Customer service escalation responses\n5. Recovery Communication Plan:\n   - What to post when the crisis stabilizes\n   - Follow-up actions\n6. Things NOT to do (common mistakes)\n7. Monitoring recommendations\n\nTone should match the brand values provided. Be specific — not generic corporate speak.`,
        },
        { role: "user", content: `Generate crisis response plan:\n\n${input}` },
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
