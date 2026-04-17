import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
export async function POST(req: NextRequest) {
  try {
    const { description } = await req.json();
    const client = new OpenAI({ baseURL: 'https://api.deepseek.com/v1', apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'system', content: 'You are a music psychologist and mood analyst with expertise in music therapy and emotional response to sound.' },
        { role: 'user', content: `Analyze the mood and emotional content of this music:\n\n${description}\n\nInclude:\n- Primary mood classification\n- Emotional arc description\n- Musical elements contributing to mood (tempo, key, instrumentation, dynamics)\n- Target emotional experience for listeners\n- Complementary tracks for an emotional journey playlist\n- Similar tracks sharing the same emotional profile` }],
      temperature: 0.8, max_tokens: 2000,
    });
    return NextResponse.json({ output: completion.choices[0]?.message?.content || 'No output generated.' });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
