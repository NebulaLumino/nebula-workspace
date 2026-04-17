import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
export async function POST(req: NextRequest) {
  try {
    const { episode, format } = await req.json();
    const client = new OpenAI({ baseURL: 'https://api.deepseek.com/v1', apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'system', content: 'You are a professional podcast producer who creates comprehensive, publication-ready show notes.' },
        { role: 'user', content: `Create professional podcast show notes:\n\nEpisode: ${episode}\nFormat: ${format}\n\n${format === 'full' ? '## Full Show Notes Include:\n- Episode title and subtitle\n- 2-3 paragraph description\n- Key topics with brief explanations\n- Timestamps for each segment\n- Guest bios with social links\n- Resources/links mentioned (formatted as markdown)\n- Sponsor read template\n- CTA and social media prompt' : format === 'seo' ? '## SEO-Optimized Notes Include:\n- Keyword-rich title and description\n- Schema markup-ready summary\n- Key phrases naturally integrated\n- Transcript snippets for search\n- Social media optimized description' : format === 'social' ? '## Social Media Version Include:\n- Instagram caption (with hooks)\n- Twitter/X thread version\n- LinkedIn post\n- Facebook event/description\n- Email newsletter blurb' : '## Short Summary Include:\n- One paragraph summary\n- 3 key takeaways\n- Top timestamp'}` }],
      temperature: 0.7, max_tokens: 2500,
    });
    return NextResponse.json({ output: completion.choices[0]?.message?.content || 'No output generated.' });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
