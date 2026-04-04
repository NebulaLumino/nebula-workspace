import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { decision, context, perspective } = await req.json();

    if (!decision) {
      return NextResponse.json({ error: "Please describe the decision you're facing." }, { status: 400 });
    }

    const prompt = `You are a clear-thinking decision analyst. Create a balanced, thorough pros and cons analysis for the following decision:

DECISION: ${decision}
CONTEXT / BACKGROUND: ${context || "Not provided"}
PERSPECTIVE: ${perspective || "First-person (I/we)"} — ${perspective === "First-person" ? "write from the decision-maker's POV" : "take a neutral third-party view"}

Generate a structured analysis:

## ⚖️ Decision Overview
A 1-2 sentence framing of what this decision involves and what's at stake.

## ✅ Pros (For)
At least 6-10 specific, well-reasoned arguments in favor. Group by theme if applicable. Include the likely positive outcome of each pro.

## ❌ Cons (Against)
At least 6-10 specific, well-reasoned arguments against. Group by theme if applicable. Include the likely risk or downside of each con.

## 🔍 Key Factors to Consider
The 3-5 most important factors that should drive this decision. Rate their importance.

## 🎯 Weighted Recommendation
Given the pros and cons, provide a nuanced recommendation — not just "do it" or "don't" — but the conditions under which this is a good or bad decision, and what could tip the balance.

## 🤔 Questions to Ask Yourself
3-5 reflective questions to help make the final call.

Be honest and unbiased. Acknowledge uncertainty. Don't just list shallow pros/cons — dig into the real trade-offs.`;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
      temperature: 0.65,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: "Failed to analyze the decision." }, { status: 500 });
  }
}
