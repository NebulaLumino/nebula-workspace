import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const { genre, bpm, complexity } = await req.json();

    const client = new OpenAI({
      baseURL: 'https://api.deepseek.com/v1',
      apiKey: process.env.OPENAI_API_KEY,
    });

    const complexityMap: Record<string, string> = {
      basic: 'Simple, foundational pattern with kick, snare, and hi-hat',
      moderate: 'Adds hats off-beats, ghost notes, and occasional fills',
      complex: 'Polyrhythmic, syncopated, with 32nd note runs and odd groupings',
      'swing-heavy': 'Shuffled rhythm with triplet feel, accented ghost notes',
    };

    const prompt = `You are a professional drum programmer and beat maker. Generate a detailed drum pattern specification.

Genre: ${genre}
BPM: ${bpm}
Complexity: ${complexityMap[complexity] || complexity}

Create a comprehensive drum pattern document that includes:
- Pattern overview (name, feel, time signature)
- BPM confirmation for the genre
- Notated drum pattern (using standard drum notation conventions)
  - Kick pattern (bar by bar, 1-16)
  - Snare/clap pattern
  - Closed hi-hat pattern
  - Open hi-hat / percussion
  - Any additional percussion elements
- Swing/shuffle percentage suggestion
- Suggested drum samples / VST plugins for this genre
- Velocity dynamics (which hits should be accented)
- Fill suggestions at bar 4 and bar 8
- Variation suggestions for the second half of an 8-bar phrase
- Groove templates for major DAWs (Ableton, Logic, FL Studio)
- DAW-specific tips (swing settings, quantize, groove pools)`;

    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'You are a professional drum programmer and beat maker with deep knowledge of drum patterns across electronic, hip-hop, rock, jazz, and world music genres.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 2500,
    });

    const output = completion.choices[0]?.message?.content || 'No output generated.';
    return NextResponse.json({ output });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
