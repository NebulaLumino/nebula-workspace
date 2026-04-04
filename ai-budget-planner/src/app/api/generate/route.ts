import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { income, expenses, goals, timeframe } = await req.json();

    if (!income || income <= 0) {
      return NextResponse.json({ error: "Please enter a valid monthly income." }, { status: 400 });
    }

    const prompt = `You are a financial planning expert. Create a detailed monthly budget plan based on the following information:

MONTHLY INCOME: $${income}
CURRENT EXPENSES (if any): ${expenses || "Not provided"}
FINANCIAL GOALS: ${goals || "General financial health"}
TIMEFRAME: ${timeframe || "Monthly"}

Create a structured budget plan with:

## 💰 Income Overview
Total monthly income: $${income}

## 📊 Budget Breakdown (50/30/20 Rule adapted)
- **Needs (50%)**: Housing, utilities, groceries, insurance, minimum debt payments
- **Wants (30%)**: Entertainment, dining out, subscriptions, hobbies
- **Savings & Debt (20%)**: Emergency fund, investments, extra debt payments

## 🎯 Detailed Allocation
For each category, provide a specific dollar amount and percentage of income.

## 💳 Debt Payoff Strategy
If monthly debt payments are mentioned, suggest a payoff strategy (avalanche vs snowball).

## 🏦 Savings Goals
Break down how to allocate the savings portion across: emergency fund (3-6 months expenses), retirement, and specific goals.

## 💡 Money-Saving Tips
3-5 actionable tips based on the provided information.

Format all numbers clearly with $ signs and percentages. Be specific and realistic.`;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 900,
      temperature: 0.6,
    });

    const plan = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ plan });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: "Failed to generate budget plan." }, { status: 500 });
  }
}
