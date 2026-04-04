import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { petType, breed, color, personality, vibe, count } = await req.json();

    const num = Math.min(Math.max(parseInt(count) || 20, 10), 40);

    const prompt = `You are a creative pet naming expert. Suggest wonderful names for a pet based on:

PET TYPE: ${petType || "Dog or Cat"}
BREED: ${breed || "Not specified"}
COLOR / MARKINGS: ${color || "Not specified"}
PERSONALITY: ${personality || "Not specified"}
NAME VIBE: ${vibe || "Cute and memorable"}
HOW MANY TO SUGGEST: ${num}

Provide a structured list of ${num} names:

## 🐶 / 🐱 Names for Your ${petType || "Pet"}
${num} creative, fitting names for this pet. For each name include:
- Name
- Origin/meaning (made up or real)
- Why it suits this pet specifically
- Category: Classic, Funny, Cute, Human, Food-themed, Nature-themed, Pop Culture, etc.

## 🌟 Standout Favorites
Your top 3 names with a longer explanation of why they're perfect for this specific pet.

## 🚫 Names to Avoid
2-3 names that might be confusing (too similar to commands) or overused.

Make names fun, affectionate, and easy to call out loud. Avoid anything that sounds like a common command ("No", "Stay", "Sit").`;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
      temperature: 0.9,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: "Failed to generate names." }, { status: 500 });
  }
}
