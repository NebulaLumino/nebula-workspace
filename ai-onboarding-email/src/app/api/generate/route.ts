import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { productName, productType, targetAudience, trialLength, onboardingGoal } = await req.json();
    if (!productName?.trim()) {
      return NextResponse.json({ error: "Product name is required." }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert onboarding and customer success strategist specializing in SaaS product activation and retention.`,
        },
        {
          role: "user",
          content: `Generate a comprehensive new customer onboarding email sequence for:

**Product Name:** ${productName}
**Product Type:** ${productType || "SaaS software, digital tool, or online platform"}
**Target Audience:** ${targetAudience || "New users who just signed up or purchased"}
**Trial Length:** ${trialLength || "14-day free trial"}
**Primary Onboarding Goal:** ${onboardingGoal || "Activate users, reduce time-to-value, prevent churn"}

Generate ALL of the following:

## 1. Onboarding Strategy Overview

### The Onboarding Arc
- How many emails to send and over what timeframe
- The single most important "aha moment" for ${productName} users
- Key activation metric to track

### Pre-Onboarding Setup
- Day 0: What happens immediately after signup/purchase
- How to handle both trial and paid customers

## 2. Day 1-3: Welcome Sequence (3 Emails)

### Email 1: Welcome + Login Instructions (Send immediately, <5 min after signup)
- **Subject lines** (5 options)
- **Preview text**
- **Email body** (warm welcome, login details, what to expect next, one clear CTA)
- **CTA:** Get them to log in and complete one micro-action

### Email 2: Quick Win Guide (Send Day 2)
- **Subject lines** (5 options)
- **Email body** (show them the fastest path to their first win — make it feel easy)
- **CTA:** Complete the quick win in under 5 minutes

### Email 3: Social Proof Reinforcement (Send Day 3)
- **Subject lines** (5 options)
- **Email body** (specific results from real customers, make it relatable)
- **CTA:** Start using the product to get your own results

## 3. Day 4-7: Activation Sequence (2 Emails)

### Email 4: Feature Spotlight (Send Day 4 or 5)
- **Subject lines** (5 options)
- **Email body** (highlight the most impactful feature for their use case, specific use case)
- **CTA:** Try this feature now (with a specific action)

### Email 5: Your First Milestone (Send Day 7)
- **Subject lines** (5 options)
- **Email body** (congratulate them on getting started, share a relevant tip or insight)
- **CTA:** Take the next step (link to upgrade or activate paid features if applicable)

## 4. Day 8-14: Trial Conversion / Retention Sequence (3 Emails)

### Email 6: Trial Halfway Check-In (Send Day 8-10 for 14-day trial)
- **Subject lines** (5 options)
- **Email body** (friendly nudge, remind them of what's available, ask if they need help)
- **CTA:** Book a 15-min onboarding call / Watch a 2-min demo video

### Email 7: Risk Reversal / Urgency (Send Day 11-12)
- **Subject lines** (5 options)
- **Email body** (gentle urgency about trial ending, emphasize what they'd lose, offer to help)
- **CTA:** Claim your paid plan / Extend trial if applicable

### Email 8: Final Day + Last Chance (Send Day 14)
- **Subject lines** (5 options)
- **Email body** (personal, human, not pushy — leave door open for the future)
- **CTA:** Unlock full access / Stay on free plan

## 5. Paid Customer Onboarding Sequence (Variant)

For paid customers, adjust the sequence:
- Replace trial-end urgency with new feature education
- Add onboarding call booking CTA (more consultative)
- Add "meet your CSM" email
- 30/60/90 day check-in sequence instead of trial-end emails

## 6. Onboarding Email Best Practices

### Timing Optimization
- Optimal send times by audience
- Time zone handling
- Day-of-week patterns

### Personalization Tips
- By industry / persona
- By signup source
- By plan tier

### Compliance & Deliverability
- Opt-out best practices
- CAN-SPAM / GDPR requirements
- How to avoid spam filters

## 7. Onboarding SMS Sequence (Optional Add-On)

3 text messages to complement the email sequence:
- Day 1: Welcome + quick link
- Day 5: "How's it going?" + support offer
- Day 13: Trial ending reminder

## 8. Metrics to Track

| Metric | Definition | Target |
|--------|-----------|--------|
- Email open rate (target: 40-60%)
- Click-through rate (target: 10-20%)
- Activation rate (% completing aha moment)
- Trial-to-paid conversion (target: 15-25%)
- Time-to-first-value (target: <48 hours)

Be specific with email copy. Every email should be warm, human, and action-oriented. Avoid corporate-sounding language.`,
        },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Onboarding email sequence generation failed." }, { status: 500 });
  }
}
