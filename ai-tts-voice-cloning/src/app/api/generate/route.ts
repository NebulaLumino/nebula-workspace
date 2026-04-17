import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
export async function POST(req: NextRequest) {
  try {
    const { text, useCase } = await req.json();
    const client = new OpenAI({ baseURL: 'https://api.deepseek.com/v1', apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'system', content: 'You are a voice technology expert specializing in TTS, neural voice cloning, and audio generation.' },
        { role: 'user', content: `Compare TTS and neural voice cloning for: ${text}\n\nUse Case: ${useCase}\n\nInclude:\n- Best tools/platforms for ${useCase} (ElevenLabs, Descript, Resemble AI, etc.)\n- Pros and cons of traditional TTS vs voice cloning\n- Pricing models and practical considerations\n- Ethical/privacy considerations\n- Step-by-step recommendation for this use case\n- Best practices for getting natural-sounding results` }],
      temperature: 0.7, max_tokens: 2500,
    });
    return NextResponse.json({ output: completion.choices[0]?.message?.content || 'No output generated.' });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
