import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
const openai = new OpenAI({ apiKey: process.env.DEEPSEEK_API_KEY || 'sk-48987c1a1dc246ecb1b52a01647e8b16', baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1' })
export async function POST(request: NextRequest) {
  try {
    const { topic, platform } = await request.json()
    const completion = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'system', content: `Create social media posts for ${platform || 'general'}` },
        { role: 'user', content: `Topic: ${topic}` }],
      temperature: 0.7, max_tokens: 1000,
    })
    return NextResponse.json({ posts: completion.choices[0]?.message?.content || '' })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
