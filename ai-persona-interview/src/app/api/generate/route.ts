import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { businessType, targetCustomer, productStage, interviewGoal, numPersonas } = await req.json();
    if (!businessType?.trim()) {
      return NextResponse.json({ error: "Business type is required." }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert UX researcher and customer interview specialist.`,
        },
        {
          role: "user",
          content: `Generate a comprehensive set of customer persona interview question banks for:

**Business Type:** ${businessType}
**Target Customer:** ${targetCustomer || "Primary buyer and end user"}
**Product Stage:** ${productStage || "Pre-launch, early stage, growth stage, or mature product"}
**Goal of Interview:** ${interviewGoal || "Understand pain points, validate product-market fit, identify features, reduce churn"}
**Number of Personas:** ${numPersonas || "1-3 distinct personas to interview"}

Generate ALL of the following:

## 1. Persona Profiles to Interview

Define the 1-3 distinct personas to interview:
- **Persona 1:** Name, role, company size, goals, frustrations, what success looks like
- **Persona 2:** (if applicable)
- **Persona 3:** (if applicable)
- **For each persona:** Primary question to identify if they're the right interview subject

## 2. Discovery / Background Questions (All Personas)

Open-ended questions to understand the person:
- 8-10 questions per persona
- Focus on role, company context, daily responsibilities, decision-making power
- Follow-up prompts for each question

## 3. Problem Discovery Questions

To uncover pain points and unmet needs:
- 10-12 questions per persona
- Focus on: frustrations with current solutions, workarounds, what's broken
- "Tell me about the last time..." questions (behavioral interviewing)
- Follow-up prompts to go deeper

## 4. Solution Validation Questions

To test your product concept or features:
- 8-10 questions per persona
- Concept testing, feature prioritization, willingness to pay
- "If you could wave a magic wand..." questions
- Ranking exercises to include

## 5. Product-Market Fit Questions

For ${productStage || "early-stage"} products — validating PMF:
- 8-10 questions
- Sean Ellis-style PMF survey questions adapted for interview
- "Must-have" vs "nice-to-have" framing
-竞争对手 comparison questions

## 6. Churn / Retention Questions (For existing products)

If this is an existing product — understanding why people stay or leave:
- 8-10 questions per persona
- For at-risk customers, power users, and churned customers
- "What would have to be true for you to cancel?"
- Competitive switching questions

## 7. Buyer vs User Gap Questions

To understand who sells vs who uses:
- 5-6 questions to understand the economic buyer
- 5-6 questions to understand the end user
- Questions that reveal the gap between them
- Escalation/approval process questions

## 8. Jobs-to-Be-Done (JTBD) Questions

Frame the conversation around functional, emotional, and social jobs:
- 8-10 JTBD-focused questions
- "What job are you hiring this product to do?"
- Timing and trigger questions
- Anxiety and access questions

## 9. Demographic & Profiling Questions

To close the interview and get context:
- 6-8 questions
- Company size, industry, budget authority, timeline, team structure
- How to ask without sounding like a sales call

## 10. Interview Guide Template

Provide a full 60-minute interview script:
- **Minutes 0-5:** Warm-up, establish rapport
- **Minutes 5-15:** Background and context
- **Minutes 15-35:** Problem discovery (core)
- **Minutes 35-50:** Solution validation or PMF questions
- **Minutes 50-60:** Wrap-up, demographic, "anything else?"

Include:
- Exact question wording
- Follow-up prompts (e.g., "Tell me more about that", "What do you mean by...")
- Red flags to watch for (lying, hedging, social desirability bias)
- Green flags to dig deeper on

## 11. Interview Best Practices

- How to recruit the right interviewees
- Incentives to offer
- How to avoid bias in questioning
- How to analyze qualitative data after
- How many interviews are enough (saturation point)

Be specific to ${businessType}. Make questions feel natural, not scripted. Include realistic follow-up prompts.`,
        },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Interview questions generation failed." }, { status: 500 });
  }
}
