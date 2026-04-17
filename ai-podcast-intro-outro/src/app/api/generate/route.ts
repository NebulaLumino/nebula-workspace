import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
export async function POST(req: NextRequest) {
  try {
    const { showName, format, tone } = await req.json();
    const client = new OpenAI({ baseURL: 'https://api.deepseek.com/v1', apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'system', content: 'You are an experienced podcast producer and brand writer who creates compelling, memorable podcast openers and closers.' },
        { role: 'user', content: `Write podcast intro and outro scripts:\n\nShow: ${showName}\nFormat: ${format}\nTone: ${tone}\n\nInclude:\n- ${format === 'short' ? 'Short intro (15-30 sec)' : format === 'extended' ? 'Extended cinematic intro (1+ min)' : 'Standard intro (45-60 sec)'} with exact word-by-word script\n- Music bed suggestion (mood, tempo, instrumentation)\n- Sound design cues (SFX, whooshes, stingers)\n- Exact timing for music vs voice\n- Outro script with call-to-action\n- Social media handle mention suggestion\n- Listener review ask\n- Next episode teaser\n- Suggested audio transition between intro music and first segment` }],
      temperature: 0.8, max_tokens: 2000,
    });
    return NextResponse.json({ output: completion.choices[0]?.message?.content || 'No output generated.' });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
