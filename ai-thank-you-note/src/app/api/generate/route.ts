import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { occasion, recipient, sender, specifics, tone } = await req.json();

    if (!occasion || !recipient) {
      return NextResponse.json({ error: "Occasion and recipient are required." }, { status: 400 });
    }

    const prompt = `You are a thoughtful, warm writer specializing in heartfelt thank you notes. Write personalized thank you notes based on:

OCCASION: ${occasion}
RECIPIENT: ${recipient}
FROM: ${sender || "Me"}
SPECIFIC DETAILS: ${specifics || "Not provided"}
TONE: ${tone || "Warm and sincere"}

Write 3 different thank you note options:

## ✉️ Note 1 — Warm & Traditional
A classic, heartfelt thank you in proper letter format. Appropriate for family, mentors, employers.

## ✉️ Note 2 — Casual & Friendly
A more relaxed, conversational tone. Good for friends, colleagues, neighbors.

## ✉️ Note 3 — Heartfelt & Personal
An emotional, deeply personal note. Good for someone who made a big impact.

For each note include:
- The full note text (ready to use)
- A suggested opening (Dear X, Hi X, etc.)
- Ideal for: who this note suits best

Keep notes concise (50-150 words each). Make them specific — reference details from the specifics field if provided. Avoid generic phrases like "I can't thank you enough."`;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 900,
      temperature: 0.8,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: "Failed to generate notes." }, { status: 500 });
  }
}
