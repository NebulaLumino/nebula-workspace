import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { commits, version, style } = await req.json();
    if (!commits?.trim()) {
      return NextResponse.json({ error: 'Commits or changes are required' }, { status: 400 });
    }

    const formatMap: Record<string, string> = {
      keepachangelog: 'Keep a Changelog format (https://keepachangelog.com)',
      conventional: 'Conventional Commits format (https://conventionalcommits.org)',
      github: 'GitHub Releases style',
      simple: 'Simple bullet list',
    };
    const fmt = formatMap[style] || formatMap.keepachangelog;
    const ver = version || 'NEW_VERSION';

    const systemPrompt = `Generate a changelog in ${fmt} format for version ${ver}. Use today's date. Be concise but informative.`;

    const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate a changelog from:\n\n${commits}` },
        ],
        temperature: 0.5,
        max_tokens: 1536,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `DeepSeek API error: ${err}` }, { status: res.status });
    }

    const data = await res.json();
    const output = data.choices?.[0]?.message?.content || 'No output generated.';
    return NextResponse.json({ output });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
