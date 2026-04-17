import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
export async function POST(req: NextRequest) {
  try {
    const { description, aspect } = await req.json();
    const client = new OpenAI({ baseURL: 'https://api.deepseek.com/v1', apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'system', content: 'You are a music technology expert with deep knowledge of AI in music production, MIDI, DAWs, and algorithmic composition.' },
        { role: 'user', content: `${aspect === 'overview' ? 'Provide a comprehensive industry overview' : aspect === 'tools' ? 'Compare AI music production tools' : aspect === 'workflow' ? 'Provide workflow integration tips' : 'Provide future predictions'} on AI in music production:\n\nTopic: ${description}\n\nInclude specific examples, tools, techniques, and actionable insights.` }],
      temperature: 0.8, max_tokens: 2000,
    });
    return NextResponse.json({ output: completion.choices[0]?.message?.content || 'No output generated.' });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
