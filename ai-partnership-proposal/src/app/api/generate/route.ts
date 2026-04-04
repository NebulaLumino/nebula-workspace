import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { yourCompany, partnerCompany, partnershipType, mutualGoals, dealValue, timeline } = await req.json();
    if (!yourCompany?.trim() || !partnerCompany?.trim()) {
      return NextResponse.json({ error: "Both your company and partner company are required." }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert business development strategist and deal architect specializing in B2B partnerships, co-marketing, and strategic alliances.`,
        },
        {
          role: "user",
          content: `Generate a comprehensive partnership proposal for:

**Your Company:** ${yourCompany}
**Target Partner Company:** ${partnerCompany}
**Partnership Type:** ${partnershipType || "Strategic business partnership (co-marketing, referral, distribution, technology, or content)"}
**Mutual Goals:** ${mutualGoals || "Lead generation, brand awareness, market expansion, product integration"}
**Estimated Deal Value:** ${dealValue || "To be discussed"}
**Timeline:** ${timeline || "Q2-Q3 2026"}

Generate a complete, professional partnership proposal document covering ALL of the following sections:

## 1. Executive Summary
- 3-paragraph overview of the partnership opportunity
- Why this makes sense for ${partnerCompany}
- Why this makes sense for ${yourCompany}
- Key deal terms at a glance

## 2. Partnership Rationale
- Market opportunity (macro trend supporting this partnership)
- Strategic fit (why ${yourCompany} + ${partnerCompany} together is stronger)
- Complementary assets (what each company brings)
- Addressable market expansion
- Competitive advantage gained

## 3. Partnership Objectives (SMART Goals)
For each objective provide:
- **Objective** (specific, measurable)
- **Success metric** (how to measure)
- **Target** (quantifiable)
- **Timeline** (when to achieve)
Cover: revenue, leads, brand reach, product outcomes

## 4. Proposed Partnership Structure

### Option A: Recommended Structure
- Type of partnership
- Roles and responsibilities for each party
- Revenue/cost sharing model
- Resource commitments (team, budget, assets)
- Governance (who manages what)

### Option B: Alternative Structure
- Alternate model with different commitment level
- Pros/cons vs Option A

## 5. Value Proposition

### For ${partnerCompany}
- What they gain (be specific — leads, revenue, brand lift, product value)
- Why now (urgency/market timing)
- Risk mitigation (what's in it for them if it doesn't work)

### For ${yourCompany}
- What you gain
- Investment required
- Strategic moat building

## 6. Financial Terms
- Investment required from each party
- Revenue sharing or cost sharing structure
- Payment milestones
- Breakage/termination clauses
- Expected ROI for each party

## 7. Phased Implementation Plan

### Phase 1: Foundation (Months 1-2)
- Key activities, deliverables, owners

### Phase 2: Activation (Months 3-4)
- Key activities, deliverables, owners

### Phase 3: Scale (Months 5-6)
- Key activities, deliverables, owners

### Phase 4: Optimization (Month 7+)
- Key activities, deliverables, owners

## 8. Key Performance Indicators (KPIs)
| KPI | Target | Measurement Method | Frequency |
|-----|--------|-------------------|-----------|
(10 KPIs across awareness, consideration, conversion, retention)

## 9. Mutual Commitments & Exclusivity
- What ${yourCompany} commits to deliver
- What ${partnerCompany} commits to deliver
- Exclusivity terms (if any)
- IP rights and ownership

## 10. Risk Assessment & Mitigation
| Risk | Likelihood | Impact | Mitigation Strategy |
|------|------------|--------|--------------------|
(5 risks with mitigation plans)

## 11. Partnership Agreement Overview
Key legal/commercial clauses to include in the formal agreement:
- Term and termination
- Confidentiality
- Liability
- IP ownership
- Dispute resolution
- Force majeure

## 12. Next Steps & Timeline to Close
- What needs to happen in the next 30 days to sign
- Decision-maker meetings required
- Due diligence items
- Target close date
- What happens if missed

## 13. Appendices (recommended)
Documents to attach:
- Company one-pagers
- Product/service overview deck
- Case studies or social proof
- Financial projections (if relevant)

Make this compelling, specific, and actionable. Use professional B2B language. Replace all placeholder language with specific, realistic examples tied to ${yourCompany} and ${partnerCompany}.`,
        },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Proposal generation failed." }, { status: 500 });
  }
}
