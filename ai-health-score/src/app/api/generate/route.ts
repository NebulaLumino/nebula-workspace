import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { businessType, customerSegments, subscriptionTiers, churnDrivers, healthMetrics } = await req.json();
    if (!businessType?.trim()) {
      return NextResponse.json({ error: "Business type is required." }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert Customer Success consultant specializing in health score modeling, churn prediction, and SaaS retention analytics.`,
        },
        {
          role: "user",
          content: `Build a comprehensive Customer Health Score system for the following business:

**Business Type:** ${businessType}
**Customer Segments:** ${customerSegments || "SMB, Mid-Market, Enterprise"}
**Subscription Tiers:** ${subscriptionTiers || "Free, Starter, Pro, Enterprise"}
**Known Churn Drivers:** ${churnDrivers || "Low engagement, non-payment, competitor switching, poor onboarding"}
**Existing Health Metrics:** ${healthMetrics || "Login frequency, feature adoption, support tickets, NPS"}

Generate ALL of the following:

## 1. Health Score Framework

Define a 0-100 health score with clear segments:
- **Healthy (80-100):** Definition + characteristics
- **At-Risk (50-79):** Warning signs + triggers
- **Critical (0-49):** Red flags + churn imminent signals
- **Expanding (101+ bonus):** Upsell/cross-sell opportunity signals

## 2. Metric Weighting Model

For each metric category, define:
- **Metric name**
- **Weight** (% contribution to overall score)
- **Data source** (where this data comes from)
- **Scoring logic** (how to score: thresholds, curves, formulas)
- **Why it matters** (retention correlation)

Categories to cover:
- Product usage signals (login frequency, feature adoption, DAU/WAU/MAU)
- Engagement depth (time in app, actions per session, core feature usage)
- Financial signals (payment history, plan tier, expansion history)
- Support signals (ticket volume, CSAT, escalation rate)
- Relationship signals (NPS, executive engagement, contract renewal proximity)
- Adoption signals (time-to-first-value, feature milestones hit)

## 3. Segment-Specific Scoring

How health scoring differs by:
- **SMB vs Enterprise** (different signals matter more)
- **New customer vs long-term** (new customers: onboarding progress; old: engagement consistency)
- **Free vs Paid** (conversion signals for free users)
- **High-touch vs low-touch** CS models

## 4. Early Warning Signals

For each churn risk category, identify the top 5 leading indicators:
- **Usage drop signals** (e.g., DAU dropped 40%+ in 2 weeks)
- **Engagement quality signals** (e.g., stopped using core feature)
- **Financial signals** (e.g., payment failed, requested downgrade)
- **Support signals** (e.g., ticket volume spike, CSAT drop)
- **Relationship signals** (e.g., champion left company, executive disengaged)

## 5. Customer Health Dashboard — Metrics to Track

Real-time or daily metrics to monitor per customer:
- Current health score (0-100)
- Trend (improving / stable / declining)
- Days since last login
- Feature adoption rate (% of available features used)
- Support CSAT score
- NPS score
- Contract renewal date
- MRR contribution
- Predicted churn probability (%)

## 6. Intervention Playbooks

For each health segment, define:
- **Healthy (80-100):** How to maintain + identify expansion opportunities
- **At-Risk (50-79):** Exactly what CSM actions to take (3-5 specific steps)
- **Critical (0-49):** Emergency playbook (who contacts, what is offered, escalation path)

## 7. Automated Alerts & Workflow Triggers

Define alert rules:
- When health score drops >20 points in 7 days → trigger alert
- When DAU < 2 days in a row for paying customer → trigger alert
- When NPS respondent is Detractor → assign to CSM within 24h
- When champion doesn't login for 14+ days → trigger outreach

## 8. Health Score Calculator Logic

Provide the actual scoring formulas:
- Weighted average formula
- How to handle missing data (e.g., customer not using a feature → penalize or N/A?)
- How to combine multi-touchpoint data
- Recommended minimum data requirements for scoring accuracy

## 9. Success Metrics for the Health Score System

- What to measure to know if the model is working
- Baseline metrics to capture before launch
- Target improvements after 90 days
- Leading vs lagging indicators of success

Be specific with numbers, thresholds, and formulas. Make this actionable for a CS team.`,
        },
      ],
      max_tokens: 1400,
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Health score generation failed." }, { status: 500 });
  }
}
