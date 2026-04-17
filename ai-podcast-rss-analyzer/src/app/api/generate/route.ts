import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
export async function POST(req: NextRequest) {
  try {
    const { rssUrl } = await req.json();
    const client = new OpenAI({ baseURL: 'https://api.deepseek.com/v1', apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'system', content: 'You are a podcast growth strategist and analytics expert with deep knowledge of podcast discoverability, audience retention, and platform optimization.' },
        { role: 'user', content: `Provide a comprehensive podcast analysis and growth strategy framework for this RSS feed:\n\nRSS URL: ${rssUrl}\n\nInclude:\n1. RSS Feed Structure Analysis Checklist\n2. Episode Release Pattern Optimization\n3. Show Notes Quality Checklist\n4. SEO and Discoverability Recommendations\n5. Audience Retention Strategies\n6. Growth Tactics by Platform (Apple Podcasts, Spotify, YouTube)\n7. Monetization Pathway Analysis\n8. Key Metrics to Track (with suggested tracking tools)\n9. Content Calendar Recommendations` }],
      temperature: 0.7, max_tokens: 2500,
    });
    return NextResponse.json({ output: completion.choices[0]?.message?.content || 'No output generated.' });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
