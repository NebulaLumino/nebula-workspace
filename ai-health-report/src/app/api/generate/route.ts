import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { customerName, accountTier, healthScore, productUsage, supportTickets, contractValue, lastContact, renewalDate, notes } = await req.json();
    if (!customerName?.trim()) {
      return NextResponse.json({ error: "Customer name is required." }, { status: 400 });
    }

    const userContent = [
      "Generate a comprehensive customer health report and playbook for:",
      "",
      "**Customer Name:** " + (customerName || "Acme Corp"),
      "**Account Tier:** " + (accountTier || "Enterprise / Mid-Market / SMB"),
      "**Current Health Score:** " + (healthScore || "85/100 — Healthy / 40/100 — At-Risk"),
      "**Product Usage Data:** " + (productUsage || "Login frequency, feature adoption, API calls, active users over last 90 days"),
      "**Support Tickets:** " + (supportTickets || "Recent support tickets, open issues, SLA compliance"),
      "**Contract Value:** " + (contractValue || "Annual contract value, expansion history"),
      "**Last Contact:** " + (lastContact || "Days since last QBR or executive touchpoint"),
      "**Renewal Date:** " + (renewalDate || "Contract renewal or expansion date"),
      "**CSM Notes:** " + (notes || "Any additional context, relationship notes, competitor mentions"),
      "",
      "Generate ALL of the following:",
      "",
      "## 1. Executive Summary",
      "2-3 sentence snapshot: overall health, top risks, recommended next action.",
      "",
      "## 2. Health Score Breakdown",
      "Score components and their values:",
      "- Product adoption score (0-100)",
      "- Engagement score (0-100)",
      "- Support health score (0-100)",
      "- Relationship health score (0-100)",
      "- Overall composite score",
      "",
      "## 3. Risk Analysis",
      "Top 3 specific risks to retention or expansion:",
      "- Risk 1: [specific, named] — Likelihood: High/Medium/Low — Impact: High/Medium/Low",
      "- Risk 2: [specific, named] — Likelihood: — Impact:",
      "- Risk 3: [specific, named] — Likelihood: — Impact:",
      "",
      "## 4. Engagement Analysis",
      "- Feature adoption: Which features are they using vs. not using (opportunity gap)",
      "- Power users identified (who on their team is the champion)",
      "- Low-engagement users (who might churn or be dormant)",
      "- Recommended adoption plays to increase stickiness",
      "",
      "## 5. Support Health Analysis",
      "- Open tickets and their status (any blocking issues?)",
      "- SLA compliance over last 90 days",
      "- Ticket trend (improving or worsening)",
      "- Escalation history",
      "- Recommendations to improve support experience",
      "",
      "## 6. Relationship Health",
      "- Champion assessment: how strong is their internal champion?",
      "- Executive sponsor: do they have one? Do they know you?",
      "- Last QBR / EBR date and outcomes",
      "- References and case study opportunities",
      "- NPS or CSAT score if available",
      "",
      "## 7. Financial Health",
      "- Contract value and YoY trend",
      "- Expansion history (upsell, cross-sell opportunities)",
      "- Price sensitivity signals",
      "- Competitive pressure signals",
      "",
      "## 8. Renewal / Expansion Risk Assessment",
      "- Renewal date and confidence level (high/medium/low)",
      "- Buyside political signals (budget freeze, re-org, new decision makers)",
      "- Competitor activity in this account",
      "- Historical pattern of similar accounts at this stage",
      "",
      "## 9. Recommended Playbook",
      "Specific actions for the CSM, organized by priority:",
      "",
      "### Immediate (This Week)",
      "- Action 1: specific and time-bound",
      "- Action 2:",
      "",
      "### This Month",
      "- Action 1:",
      "- Action 2:",
      "- Action 3:",
      "",
      "### Pre-Renewal (90 Days Out)",
      "- Action 1:",
      "- Action 2:",
      "",
      "## 10. Expansion Opportunities",
      "Identify upsell and cross-sell opportunities:",
      "- Products/features not yet adopted that solve their known pain points",
      "- Seats or usage expansion signals",
      "- Timing for expansion conversation",
      "- Executive alignment needed for expansion",
      "",
      "## 11. Alert Flags",
      "🚩 Any warning signs requiring immediate attention:",
      "- Open blockers",
      "- Champion departure risk",
      "- Competitor replacement attempt",
      "- Budget risk signals",
      "",
      "Be specific to the data provided. Avoid generic advice. Focus on actionable insights.",
    ].join("\n");

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are an expert customer success manager with deep expertise in SaaS retention, churn prediction, and account health." },
        { role: "user", content: userContent },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Health report generation failed." }, { status: 500 });
  }
}
