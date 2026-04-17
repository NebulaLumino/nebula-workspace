import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
export async function POST(req: NextRequest) {
  try {
    const { genre } = await req.json();
    const client = new OpenAI({ baseURL: 'https://api.deepseek.com/v1', apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'system', content: 'You are a professional mastering engineer with expertise in LUFS, loudness normalization, and AI mastering tools.' },
        { role: 'user', content: `Create a comprehensive AI mastering guide for ${genre} music:\n\nInclude:\n- LUFS loudness targets for streaming platforms (Spotify, Apple Music, YouTube) for ${genre}\n- History of the loudness war and how it affects ${genre} specifically\n- AI mastering tool recommendations (LANDR, Ozone, iZotope, etc.)\n- Step-by-step AI mastering workflow\n- Common mistakes in ${genre} mastering\n- How to prepare your mix for AI mastering\n- Manual mastering checks to do after AI processing\n- Reference tracks for ${genre}\n- Specific EQ and dynamics considerations for ${genre}` }],
      temperature: 0.7, max_tokens: 2500,
    });
    return NextResponse.json({ output: completion.choices[0]?.message?.content || 'No output generated.' });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
