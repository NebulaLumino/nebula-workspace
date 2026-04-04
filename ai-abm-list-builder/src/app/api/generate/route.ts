import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { companyType, targetGeography, companySize, industry, dealValue, techStack } = await req.json();
    if (!companyType?.trim()) {
      return NextResponse.json({ error: "Company type is required." }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert Account-Based Marketing (ABM) strategist and B2B sales intelligence specialist.`,
        },
        {
          role: "user",
          content: `Generate a comprehensive Account-Based Marketing (ABM) target account list and strategy for:

**Company Type / ICP:** ${companyType}
**Target Geography:** ${targetGeography || "United States"}
**Company Size:** ${companySize || "50-500 employees"}
**Industry / Vertical:** ${industry || "SaaS, Technology, Financial Services, Healthcare"}
**Target Deal Value:** ${dealValue || "$10K-$100K ACV"}
**Tech Stack / Signals:** ${techStack || "Companies using Salesforce, HubSpot, Slack, Zoom"}

Generate ALL of the following:

## 1. ICP Definition — Ideal Customer Profile

Define your Ideal Customer Profile with specificity:
- **Company attributes:** size, revenue, industry, geography, tech stack
- **Firmographic signals:** funding stage, growth rate, headcount trends
- **Technographic signals:** what tools they already use (and which means they're ready to buy)
- **Behavioral signals:** hiring patterns, website activity, content consumption, event attendance
- **Intent signals:** what actions indicate they're in-market
- **Psychographic signals:** decision-maker mindset, priorities, pain points

## 2. TAM / SAM / SOM Analysis

| Layer | Definition | Estimated Size | Notes |
|-------|-----------|---------------|-------|
| TAM (Total Addressable Market) | ... | ... | ... |
| SAM (Serviceable Available Market) | ... | ... | ... |
| SOM (Serviceable Obtainable Market) | ... | ... | ... |

How to calculate and justify each number.

## 3. Named Account List (30-50 Companies)

Generate a realistic list of 30-50 target accounts organized by tier:

### Tier 1 — Priority Accounts (10-15)
Highest fit + highest intent signals. For each:
- **Company name:** [Realistic fictional name]
- **Industry:** ...
- **Size:** ...
- **Why they're a target:** [Specific reason]
- **Key trigger event:** [Recent funding, new hire, expansion, etc.]
- **Estimated deal value:** ...
- **Who to target:** [Title/department]

### Tier 2 — Secondary Accounts (10-15)
Strong fit, lower intent. Same details.

### Tier 3 — Warm Accounts (5-10)
Some fit, known to be in-market or referred. Same details.

### Tier 4 — Expansion Opportunities (5-10)
Existing customers who could upgrade. (If applicable)

## 4. Account Intelligence Cards

For the top 10 accounts, provide a detailed card:
- **Company overview:** description, funding, HQ, growth trajectory
- **Key decision makers:** titles, names (use realistic placeholder names), how to reach them
- **Known challenges:** 2-3 pain points this company likely faces
- **Trigger events:** recent news, hires, funding, expansions
- **Tech stack:** what they likely use
- **Outreach hook:** the specific angle for outreach

## 5. Account Scoring Model

Create a lead scoring framework for ABM accounts:

### Tier Assignment Criteria
| Score | Tier | Criteria |
|-------|------|----------|
| 90-100 | Tier 1 | ... |
| 70-89 | Tier 2 | ... |
| 50-69 | Tier 3 | ... |
| <50 | Nurture | ... |

### Scoring Dimensions
- **Firmographic fit** (0-30 points): company size, industry, geography
- **Technographic fit** (0-25 points): compatible tech stack, competitive tech (churn risk = high intent)
- **Behavioral signals** (0-25 points): website visits, content downloads, email engagement, event attendance
- **Intent signals** (0-20 points): competitor research, category searches, job postings indicating growth

## 6. Outreach Channel Strategy

For each tier:
### Tier 1 — How to reach them
- Primary channel: (LinkedIn, email, phone, events, warm intro)
- Cadence: (number of touches, over what timeframe)
- Key message angle: (what to say)

### Tier 2 — How to reach them
[Same structure]

### Tier 3 — How to reach them
[Same structure]

### Channel Mix Recommendations
- LinkedIn (recommended % of outreach)
- Cold email (recommended %)
- Phone/sequences (recommended %)
- Events/conferences (recommended %)

## 7. Multi-Threading Strategy

For enterprise accounts — who to contact and in what order:
- **Executive sponsor:** VP/C-suite — message angle
- **Economic buyer:** CFO/VP Finance — message angle
- **Technical evaluator:** IT/Engineering — message angle
- **End user champion:** Manager/Director — message angle
- **Blockers to identify:** Procurement, Legal — how to navigate

## 8. Content & Asset Strategy by Account Stage

| Account Stage | Content Needed | Channel | Goal |
|---------------|---------------|---------|------|
| Awareness | ... | ... | ... |
| Consideration | ... | ... | ... |
| Decision | ... | ... | ... |

## 9. Measurement & KPIs

| KPI | Target | Measurement Frequency |
|-----|--------|---------------------|
- Accounts in market
- Accounts engaged
- Accounts with multi-threading
- Pipeline created from ABM
- Win rate on ABM accounts
- ABM-influenced revenue

## 10. ABM Tool Recommendations

Best tools for each function:
- **Intent data:** (e.g., Bombora, G2, TechTarget)
- **CRM / ABM platform:** (e.g., HubSpot, Salesforce + ABM tools)
- **LinkedIn prospecting:** (e.g., LinkedIn Sales Navigator)
- **Email verification:** (e.g., Apollo, ZeroBounce)
- **Personalization at scale:** (e.g., Outreach, Salesloft, Mutiny)

Be specific with company names, titles, deal values, and metrics. The account list should feel like a real sales team's target list.`,
        },
      ],
      max_tokens: 1600,
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "ABM list generation failed." }, { status: 500 });
  }
}
