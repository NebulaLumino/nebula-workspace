import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const { model, stage } = await req.json();
    if (!model?.trim()) {
      return NextResponse.json({ error: "Business model description is required" }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://api.deepseek.com/v1",
    });

    const stageStr = stage || "Seed";
    const prompt = `You are a SaaS analytics expert. Generate a comprehensive metrics dashboard framework.

SaaS Business Model: ${model}
Current Stage: ${stageStr}

Please generate:
1. **Dashboard Overview** - The story your metrics tell
2. **Revenue Metrics**
   - MRR (Monthly Recurring Revenue) - target and formula
   - ARR (Annual Recurring Revenue)
   - ARPU (Average Revenue Per User)
   - Net New MRR - breakdown of expansion vs. new vs. churn
3. **Growth Metrics**
   - New MRR
   - Expansion MRR
   - Logo Retention Rate
4. **Churn Metrics**
   - Customer Churn Rate
   - Revenue Churn Rate
   - Churned MRR
5. **Unit Economics**
   - LTV (Customer Lifetime Value)
   - CAC (Customer Acquisition Cost)
   - LTV:CAC Ratio
   - Payback Period
6. **Efficiency Metrics**
   - Net Revenue Retention (NRR)
   - Magic Number
   - Rule of 40
7. **Cohort Analysis Framework** - How to set up and interpret cohorts
8. **Dashboard Priorities by Stage** - Which metrics matter most at ${stageStr} stage

For each metric include: definition, formula, benchmark, and target for the stage.`;

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are an expert SaaS analytics and metrics specialist.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const result = completion.choices[0]?.message?.content || "No framework generated.";
    return NextResponse.json({ result });
  } catch (err: unknown) {
    console.error("Generation error:", err);
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
