import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const { mood, genre, key } = await req.json();
    const client = new OpenAI({ baseURL: 'https://api.deepseek.com/v1', apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'You are a professional music theory teacher and composer. Generate rich, detailed chord progression breakdowns.' },
        { role: 'user', content: `Generate a chord progression for the following parameters:\n\nMood: ${mood}\nGenre: ${genre}\nKey: ${key}\n\nInclude:\n- Chord symbols and roman numeral analysis\n- Voice leading suggestions (smooth bass and melody lines)\n- Characteristic chord substitutions for the genre/mood\n- Chord progression diagram/notation\n- Tips for reharmonization possibilities\n- ${genre === 'jazz' ? 'Alteration suggestions, tritone substitutions, ii-V-I patterns' : genre === 'pop' ? 'Common pop chord tropes and borrowed chords' : 'Genre-specific harmonic language'}\n- A musical explanation of why this progression works for ${mood} feeling in ${genre}` },
      ],
      temperature: 0.8, max_tokens: 2000,
    });
    return NextResponse.json({ output: completion.choices[0]?.message?.content || 'No output generated.' });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
