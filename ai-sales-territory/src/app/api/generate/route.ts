import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { companyName, salesTeamSize, productType, targetSegments, currentTerritories, numReps, numTerritories } = await req.json();
    if (!companyName?.trim()) {
      return NextResponse.json({ error: "Company name is required." }, { status: 400 });
    }

    const userContent = [
      "Generate a comprehensive sales territory planning document for:",
      "",
      "**Company:** " + (companyName || "My Company"),
      "**Sales Team Size:** " + (salesTeamSize || "10 reps"),
      "**Product Type:** " + (productType || "B2B SaaS, mid-market, PLG + SLG"),
      "**Target Segments:** " + (targetSegments || "Mid-market SaaS, FinTech, Healthcare tech, E-commerce"),
      "**Current Territories (if any):** " + (currentTerritories || "Geographic split (East/West/Central) — not working well)"),
      "**Number of Sales Reps:** " + (numReps || "10 reps"),
      "**Number of Territories:** " + (numTerritories || "5-6 territories"),
      "",
      "Generate ALL of the following:",
      "",
      "## 1. Territory Design Strategy",
      "- Recommended segmentation basis (geographic, vertical, segment, hybrid)",
      "- Rationale for the chosen approach",
      "- How to balance territories for equitable opportunity",
      "- Recommended territory count and composition",
      "",
      "## 2. Territory Definitions",
      "For each territory provide:",
      "- Territory name and code",
      "- Geographic or segment scope",
      "- Target customer profile (company size, industry, geography)",
      "- Total addressable market estimate for this territory ($)",
      "- Number of target accounts",
      "- Recommended quota for this territory",
      "",
      "## 3. Account Tiering within Territories",
      "For each territory:",
      "- Tier 1 (A-level) accounts: Top 20% by opportunity (specific company examples)",
      "- Tier 2 (B-level) accounts: Middle 50%",
      "- Tier 3 (C-level) accounts: Bottom 30%",
      "- How to allocate A/B/C accounts across reps fairly",
      "",
      "## 4. Coverage Model",
      "- Direct assignment model vs. rotational model vs. team selling",
      "- How named accounts vs. territory accounts are split",
      "- Overlay structure (SEs, sales engineers) allocation by territory",
      "- hICH ratio recommendations by territory type",
      "",
      "## 5. Quota Allocation Framework",
      "- How to set quotas that are ambitious but achievable",
      "- Quota by territory with breakdown by quarter",
      "- Fair quota allocation across territories (with \"level\" adjustments for territory maturity)",
      "- Ramp plan for new reps in new territories",
      "",
      "## 6. Routing & Handoff Rules",
      "- Inbound lead routing rules by territory",
      "- SDR-to-AE handoff criteria",
      "- What happens when a prospect spans two territories",
      "- New logo vs. expansion account rules",
      "",
      "## 7. Growth Roadmap",
      "- Q1: Initial territory launch (baseline metrics)",
      "- Q2: Territory refinement based on Q1 learnings",
      "- Q3: Territory expansion or rebalancing",
      "- Q4: Full-year territory optimization",
      "",
      "## 8. Key Metrics by Territory",
      "Track these metrics by territory monthly:",
      "- Pipeline coverage ratio (3x quota)",
      "- Win rate by tier",
      "- Average deal size",
      "- Sales cycle length",
      "- Quota attainment %",
      "- Ramp time for new reps",
      "",
      "Make the plan specific and actionable. Include named account examples, realistic quota numbers, and specific metrics targets.",
    ].join("\n");

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are an expert sales operations and territory planning specialist." },
        { role: "user", content: userContent },
      ],
      max_tokens: 1400,
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Territory plan generation failed." }, { status: 500 });
  }
}
