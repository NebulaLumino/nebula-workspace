import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
const openai = new OpenAI({ apiKey: process.env.DEEPSEEK_API_KEY || 'sk-48987c1a1dc246ecb1b52a01647e8b16', baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1' })
export async function POST(request: NextRequest) {
  try {
    const { role, count } = await request.json()
    const completion = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'system', content: 'Generate interview questions with sample answers.' },
        { role: 'user', content: `Role: ${role || 'software engineer'}\nCount: ${count || 5}` }],
      temperature: 0.7, max_tokens: 1500,
    })
    const response = completion.choices[0]?.message?.content
    if (!response) return NextResponse.json({ error: 'No response' }, { status: 500 })
    return NextResponse.json({ questions: response })
  } catch (error) { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
