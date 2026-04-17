import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const { topic, format, duration, tone } = await req.json();

    const client = new OpenAI({
      baseURL: 'https://api.deepseek.com/v1',
      apiKey: process.env.OPENAI_API_KEY,
    });

    const formatGuides: Record<string, string> = {
      solo: 'Solo presentation with intro, main content segments, and closing',
      interview: 'Interview format with host intro, guest intro, question-answer segments, and wrap-up',
      'co-host': 'Two hosts with back-and-forth banter, shared segments, and round-up',
      panel: 'Multiple speakers with moderation, opening statements, panel discussion, and closing',
    };

    const prompt = `You are an experienced podcast scriptwriter. Write a complete, production-ready podcast script.

Episode Topic: ${topic}
Format: ${formatGuides[format] || format}
Duration: ~${duration} minutes
Tone: ${tone}

Include:
- A compelling hook/opening (first 30 seconds)
- Structured segments with clear transitions
- Suggested timing for each segment
- ${format === 'interview' ? 'Interview questions (5-8), guest intro/outro copy' : 'Content talking points and key points to cover'}
- Sponsor read template (if applicable — use placeholder brand [SPONSOR])
- Mid-roll ad placement suggestions
- Closing with call-to-action and social media prompt
- Suggested music/sound cue placements
- Breathing room cues for natural pacing

Write in a natural, conversational script format ready for recording.`;

    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'You are an experienced podcast writer and producer who has written scripts for shows with millions of downloads. You write natural, engaging scripts optimized for audio listening.' },
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
