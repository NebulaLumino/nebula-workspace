import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const { topic, audience, format } = await req.json();
    const client = new OpenAI({ baseURL: 'https://api.deepseek.com/v1', apiKey: process.env.OPENAI_API_KEY });
    const guestCount = format === 'panel' ? 5 : format === 'dual' ? 2 : 1;
    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'You are a podcast booking agent and media strategist with deep knowledge of podcast guests across industries.' },
        { role: 'user', content: `Find ideal podcast guests for the following episode:\n\nTopic: ${topic}\nTarget Audience: ${audience}\nFormat: ${format}\n\nProvide ${guestCount === 1 ? 'the single best guest' : `exactly ${guestCount} guest suggestions`}:\n\nFor each guest include:\n- Name and professional title\n- Why they're perfect for this topic\n- Their existing podcast/media presence\n- Suggested talking points (3-5)\n- Audience overlap with your show\n- Contact/outreach strategy\n- Backup guests in case primary guest declines\n- Questions to ask that will make great content\n\nBe specific, actionable, and realistic.` },
      ],
      temperature: 0.8, max_tokens: 2500,
    });
    return NextResponse.json({ output: completion.choices[0]?.message?.content || 'No output generated.' });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
