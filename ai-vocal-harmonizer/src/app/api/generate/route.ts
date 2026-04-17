import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
export async function POST(req: NextRequest) {
  try {
    const { key, style } = await req.json();
    const client = new OpenAI({ baseURL: 'https://api.deepseek.com/v1', apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'system', content: 'You are a professional vocal arranger and harmony specialist with experience in pop, gospel, classical, and jazz harmony.' },
        { role: 'user', content: `Create a vocal harmony arrangement:\n\nKey: ${key}\nStyle: ${style}\n\nInclude:\n- Recommended harmony intervals (root, 3rd, 5th, 7th etc.)\n- Specific chord voicings for ${style} style\n- Parallel motion warnings (parallel fifths, octaves)\n- Melodic motion suggestions (contrary vs parallel motion)\n- Suggested number of harmony voices (2nd voice, 3rd voice, etc.)\n- Tension chord approaches\n- Example progression in ${key} with full 4-part voicing notation\n- DAW-specific tips for implementing vocal harmonies\n- Auto-tune/harmony plugin settings suggestions` }],
      temperature: 0.8, max_tokens: 2500,
    });
    return NextResponse.json({ output: completion.choices[0]?.message?.content || 'No output generated.' });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
