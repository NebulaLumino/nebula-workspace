import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const getClient = () =>
  new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://api.deepseek.com/v1',
  });

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) return NextResponse.json({ error: 'No prompt provided' }, { status: 400 });

    const client = getClient();
    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `You are an expert OKR (Objectives & Key Results) strategist. Based on the provided context, generate:
1. 3-5 clear Objectives (qualitative, inspiring, time-bound)
2. 2-4 Key Results per Objective (quantitative, measurable, achievable)
3. For each Key Result: current baseline, target value, measurement method
4. AI Insights: at-risk indicators, momentum score, alignment notes
5. Weekly check-in prompts to track progress

Format with clear hierarchy: Objective → Key Results → Metrics. Use numerical targets where possible.`,
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.5,
    });

    return NextResponse.json({ output: completion.choices[0].message.content });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
