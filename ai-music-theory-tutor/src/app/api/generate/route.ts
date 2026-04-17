import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const { topic, level } = await req.json();
    const client = new OpenAI({ baseURL: 'https://api.deepseek.com/v1', apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: `You are a professional music theory teacher. Explain concepts clearly at an ${level} level with examples, exercises, and ear training tips.` },
        { role: 'user', content: `Teach me about: ${topic}\n\nLevel: ${level}\n\nStructure your lesson as:\n1. Concept overview (what it is, why it matters)\n2. Theory foundation (the rule/patter)\n3. Musical examples (2-3 examples from famous songs or compositions)\n4. How to apply it (in ${level} level practical terms)\n5. Common mistakes and how to avoid them\n6. Ear training exercise (how to recognize this concept by ear)\n7. Practice suggestions and next steps\n\nUse plain language and musical examples.` },
      ],
      temperature: 0.8, max_tokens: 2500,
    });
    return NextResponse.json({ output: completion.choices[0]?.message?.content || 'No output generated.' });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
