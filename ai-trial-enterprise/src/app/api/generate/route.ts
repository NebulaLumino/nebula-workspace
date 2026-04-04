import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { productName, trialLength, currentPricing, targetSegments, conversionRate, avgDealSize } = await req.json();
    if (!productName?.trim()) {
      return NextResponse.json({ error: "Product name is required." }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert SaaS revenue strategist specializing in trial-to-paid conversion, enterprise sales, and expansion revenue.`,
        },
        {
          role: "user",
          content: `Generate a comprehensive Trial to Enterprise Upgrade Calculator & Strategy for:

**Product Name:** ${productName}
**Trial Length:** ${trialLength || "14 days"}
**Current Pricing Tiers:** ${currentPricing || "Starter $29/mo, Pro $79/mo, Enterprise custom"}
**Target Customer Segments:** ${targetSegments || "SMB (5-50 employees), Mid-Market (50-500), Enterprise (500+)"}
**Current Trial-to-Paid Conversion Rate:** ${conversionRate || "~10-15%"}
**Average Deal Size:** ${avgDealSize || "$79 MRR average"}

Generate ALL of the following:

## 1. Current State Baseline Analysis

### Trial Funnel Metrics
- Expected trial sign-ups per month (model based on your conversion rate)
- Trial-to-paid conversion rate benchmark for ${trialLength || "14-day"} trials in SaaS
- Where you likely sit vs industry average
- Revenue leakage from trial pool

### Industry Benchmarks
- Average trial conversion rate by category
- Best-in-class trial conversion rates
- Average time-to-convert from trial
- Free trial vs paid trial vs freemium benchmarks

## 2. Enterprise Upgrade Opportunity Sizing

### Revenue Impact Model
Calculate the upside if you improve trial-to-paid conversion by specific amounts:

| Conversion Uplift | New Monthly Revenue | Annual Revenue Gain | Notes |
|------------------|---------------------|--------------------|-------|
| +1% (e.g., 10%→11%) | ... | ... | ... |
| +3% | ... | ... | ... |
| +5% | ... | ... | ... |
| +10% | ... | ... | ... |

### Enterprise Segment Opportunity
- What percentage of trial users have enterprise signals
- Typical enterprise deal size vs SMB
- Enterprise trial-to-close rate benchmarks
- Multi-stakeholder deal complexity

## 3. Trial-to-Enterprise Funnel Analysis

For each stage, define the drop-off points:

### Stage 1: Trial Sign-up to Activation (Day 1-3)
- **Ideal behavior:** Key action they should complete
- **Current drop-off:** Where people fall off
- **Fixes:** Specific interventions

### Stage 2: Activation to Value Discovery (Day 4-7)
- **Ideal behavior:** Realizes a key outcome
- **Current drop-off:** Where people lose interest
- **Fixes:** Specific interventions

### Stage 3: Value to Upgrade Consideration (Day 8-14)
- **Ideal behavior:** Actively using product, evaluating ROI
- **Current drop-off:** Where they decide not to buy
- **Fixes:** Specific interventions

### Stage 4: Trial Expiry to Churn (Day 14+)
- **What happens when trial ends** (expire vs convert vs upgrade)
- **Win-back opportunities**
- **Post-trial re-engagement sequence

## 4. Enterprise Upgrade Pricing Calculator

Build a pricing calculator model:

### Tier Migration Path
| From Plan | To Plan | Price Increase | What They Gain | Upgrade Trigger |
|-----------|---------|---------------|----------------|----------------|
| Trial → Starter | ... | ... | ... | ... |
| Trial → Pro | ... | ... | ... | ... |
| Trial → Enterprise | ... | ... | ... | ... |
| Starter → Pro | ... | ... | ... | ... |
| Pro → Enterprise | ... | ... | ... | ... |

### Enterprise Contract Calculator
- Annual vs monthly pricing (typical discount: 15-20% for annual)
- Seat-based vs flat vs usage pricing
- Implementation/Onboarding fees
- Professional services add-ons
- Expected enterprise deal size range for this product category

## 5. Trial Experience Optimization Playbook

### Week 1: New Trial Onboarding (Days 1-7)
- Day 1: Welcome email + first-action checklist
- Day 2-3: Check-in email with tips
- Day 5: Value delivered email ("here's what you could have done")
- Day 7: Mid-trial survey + 1-on-1 demo offer

### Week 2: Conversion Push (Days 8-14)
- Day 10: Urgency email ("X days left")
- Day 12: Personalized case study
- Day 14 (final): Last chance + special offer
- Day 15: Post-trial follow-up sequence

## 6. Enterprise-Specific Trial Strategies

### For SMB Trials (5-50 employees)
- How to identify enterprise-ready signals early
- Self-serve upgrade triggers
- Pricing anchoring for SMB upsells

### For Mid-Market Trials (50-500 employees)
- Trial length recommendation (14 or 30 days)
- Multi-user trial activation strategy
- Who to get into the trial (champion vs executive)
- How to book a sales call during trial

### For Enterprise Trials (500+ employees)
- Extended trial negotiation (30-90 days)
- Proof-of-concept / pilot vs standard trial
- Business unit vs company-wide trial
- Legal/compliance requirements for enterprise
- Executive sponsorship strategy

## 7. Sales-Assisted Upgrade Strategy

### When to bring in a sales rep
- Trigger signals during trial (feature usage, team size, specific actions)
- Lead scoring model for trial users
- Rep outreach timing (day 3-5 is ideal)

### Demo Script for Upgrade Call
- How to demo specifically to upgrade-seekers
- Common objections during enterprise trial-to-close
- Pricing negotiation tactics

## 8. ROI Calculator for Customer

Help the customer justify the upgrade:
- Cost of not upgrading (missed productivity, manual workarounds)
- ROI calculation framework (time saved × hourly rate)
- Break-even analysis (e.g., "payback in X days/weeks")
- Business case template for procurement/finance

## 9. KPIs to Track

| KPI | Current Baseline | Target | How to Measure |
|-----|-----------------|--------|----------------|
- Trial activation rate
- Trial-to-paid conversion rate
- Trial-to-enterprise conversion rate
- Average trial duration
- Cost per trial activation
- Revenue per trial user

## 10. Quick Wins (Next 2 Weeks)
- 3-5 highest-impact, lowest-effort changes to improve trial conversion
- A/B test priorities

Be specific with numbers. Every recommendation should include realistic benchmarks and dollar figures.`,
        },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upgrade calculator generation failed." }, { status: 500 });
  }
}
