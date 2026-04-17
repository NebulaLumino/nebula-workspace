import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const { title, genre, length, style } = await req.json();

    const client = new OpenAI({
      baseURL: 'https://api.deepseek.com/v1',
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `You are a professional audiobook narrator and director. Create a detailed audiobook narration script with character voice notes and pacing guidance.

Book: ${title}
Genre: ${genre}
Length: ${length}
Narrator Style: ${style}

Create a narration production document that includes:
- Overall narration tone and pacing guide
- Character voice descriptions (pitch, pace, accent hints, personality)
- Suggested voice-over talent descriptions for casting
- Sample narration reading of the first 2-3 paragraphs
- Pacing notes (where to slow down, pause, speed up)
- Emotional beat markers (moments of tension, joy, sadness)
- Pronunciation guide for unusual names/terms
- Music and ambient sound suggestions (if applicable)
- Chapter transition guidance
- Technical recording tips (room tone, mic distance, breath control)`;

    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'You are a professional audiobook narrator and voice director with years of experience recording fiction and non-fiction titles across all genres.' },
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
