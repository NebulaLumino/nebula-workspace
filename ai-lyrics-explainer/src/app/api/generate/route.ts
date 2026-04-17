import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
export async function POST(req: NextRequest) {
  try {
    const { song, depth } = await req.json();
    const client = new OpenAI({ baseURL: 'https://api.deepseek.com/v1', apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'system', content: `You are a literary critic and music journalist with expertise in lyrical analysis, literary devices, and cultural history.` },
        { role: 'user', content: `Conduct a ${depth === 'quick' ? 'brief' : depth === 'medium' ? 'detailed' : 'deep academic'} analysis of the following song/lyrics:\n\n${song}\n\nInclude:\n${depth !== 'quick' ? '- Core themes and central messages\n- Literary devices used (metaphor, alliteration, assonance, symbolism, etc.)\n- Rhyme scheme and structural analysis\n- Historical and cultural context\n- Artist intent and personal context\n- Interpretive analysis' : '- Main theme\n- Key memorable lines\n- Brief contextual note'}` }],
      temperature: 0.7, max_tokens: depth === 'deep' ? 3000 : depth === 'medium' ? 2000 : 1000,
    });
    return NextResponse.json({ output: completion.choices[0]?.message?.content || 'No output generated.' });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
