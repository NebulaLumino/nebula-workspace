import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { company, quarter, department, companyGoals, teamSize, industry } = await req.json();
    if (!company?.trim()) {
      return NextResponse.json({ error: "Company name is required." }, { status: 400 });
    }

    const userContent = [
      "Generate a complete OKR (Objectives & Key Results) package for:",
      "",
      "**Company:** " + (company || "NovaTask Inc."),
      "**Quarter:** " + (quarter || "Q2 2026"),
      "**Department:** " + (department || "Company-wide / Engineering / Sales / Marketing / Product"),
      "**Company-Level Goals:** " + (companyGoals || "Revenue growth, customer success, product excellence, team scaling"),
      "**Team Size:** " + (teamSize || "50-person company"),
      "**Industry:** " + (industry || "SaaS / Technology"),
      "",
      "Generate ALL of the following:",
      "",
      "## 1. Executive Summary",
      "2-3 sentences: what the company is focusing on this quarter and why.",
      "",
      "## 2. Company-Level OKRs",
      "3-5 company objectives, each with 2-3 measurable key results:",
      "",
      "**Objective 1: [Name]**",
      "KR1: [Measurable result] — from [baseline] to [target] by [date]",
      "KR2: [Measurable result] — from [baseline] to [target] by [date]",
      "KR3: [Measurable result] — from [baseline] to [target] by [date]",
      "",
      "(Repeat for each Objective)",
      "",
      "## 3. Department OKRs",
      "For each relevant department (Engineering, Sales, Marketing, Product, Customer Success):",
      "",
      "### [Department Name]",
      "**O1: [Objective]**",
      "KR1: [Key Result with baseline and target]",
      "KR2:",
      "",
      "## 4. Grading Rubric",
      "How to score each KR at end of quarter:",
      "- 0.0-0.3: Did not make meaningful progress",
      "- 0.4-0.6: Made progress but fell short of target",
      "- 0.7-0.9: Nearly met target (committed)",
      "- 1.0: Met target",
      "- 1.1+: Exceeded target",
      "",
      "## 5. Check-in Cadence",
      "Recommended weekly/bi-weekly OKR check-in format:",
      "- Progress update: What did we complete?",
      "- Confidence level: On track (green) / At risk (yellow) / Off track (red)",
      "- Blockers: What is preventing progress?",
      "- Adjustments: Any KR modifications needed?",
      "",
      "## 6. Scorecard Template",
      "End-of-quarter scorecard:",
      "| Objective | KR | Baseline | Target | Actual | Score | Notes |",
      "|---|---|---|---|---|---|---|",
      "| O1 | KR1 | | | | | |",
      "| O1 | KR2 | | | | | |",
      "",
      "## 7. Common Pitfalls",
      "Top 5 mistakes teams make with OKRs and how to avoid them:",
      "",
      "## 8. Tips for Ambitious but Achievable KRs",
      "Guidance on setting KRs that stretch the team without being demotivating.",
      "",
      "Format KRs using the format: \"Measure X from [baseline] to [target]\" with specific numbers.",
    ].join("\n");

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are an expert OKR facilitator and strategy consultant." },
        { role: "user", content: userContent },
      ],
      max_tokens: 1400,
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "OKR generation failed." }, { status: 500 });
  }
}
