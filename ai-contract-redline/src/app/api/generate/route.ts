import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { contractType, counterparty, changes, yourPosition, concerns } = await req.json();
    if (!contractType?.trim()) {
      return NextResponse.json({ error: "Contract type is required." }, { status: 400 });
    }

    const userContent = [
      "Analyze the following contract redline and generate a summary for a business stakeholder:",
      "",
      "**Contract Type:** " + (contractType || "MSA, SOW, SaaS subscription agreement, partnership agreement, NDA"),
      "**Counterparty:** " + (counterparty || "Who is proposing these terms"),
      "**Summary of Changes/Key Terms:**\n" + (changes || "Paste the key terms, redline changes, or contract sections to analyze"),
      "**Your Company's Position:** " + (yourPosition || "Buyer / Seller / Partner / Vendor"),
      "**Specific Concerns:** " + (concerns || "Any particular issues flagged by legal or business teams"),
      "",
      "Generate ALL of the following:",
      "",
      "## 1. Executive Summary",
      "2-3 sentences explaining what this contract is about, the key changes from prior versions, and the overall risk/reward assessment.",
      "",
      "## 2. Key Business Terms",
      "- Contract type and purpose",
      "- Term and renewal (length, automatic renewal, notice period)",
      "- Pricing and payment terms",
      "- Scope of services or deliverables",
      "- Key milestones or commitments",
      "",
      "## 3. Risk Analysis",
      "Organized by severity:",
      "",
      "### High Risk (Negotiate Hard)",
      "For each: what the risk is, why it matters, recommended position.",
      "",
      "### Medium Risk (Seek Modification)",
      "For each: what the concern is, suggested alternative language.",
      "",
      "### Low Risk (Accept with Monitoring)",
      "Items to accept as-is but monitor during execution.",
      "",
      "## 4. Negotiating Priorities",
      "Your top 5 negotiating priorities ranked by importance:",
      "",
      "| Priority | Issue | Current Language | Proposed Language | Walk-away Position |",
      "|---|---|---|---|---|",
      "| 1 | | | | |",
      "| 2 | | | | |",
      "",
      "## 5. Liability & Indemnification",
      "- Indemnification scope (who indemnifies whom for what)",
      "- Liability caps (are they appropriate?)",
      "- Mutual vs. one-sided indemnification",
      "- IP indemnification (especially for SaaS/Tech contracts)",
      "",
      "## 6. Data & IP Provisions",
      "- Data ownership (who owns customer data, usage data)",
      "- IP ownership of deliverables",
      "- Data processing agreement (GDPR/CCPA compliance)",
      "- Security requirements and certifications required",
      "",
      "## 7. Termination Rights",
      "- Termination for convenience (can either party exit easily?)",
      "- Termination for cause (what constitutes material breach)",
      "- Transition assistance obligations",
      "- Survival clauses (what survives termination)",
      "",
      "## 8. Recommended Actions",
      "Specific steps for legal and business teams:",
      "- Items to escalate to outside counsel",
      "- Standard provisions to accept without negotiation",
      "- Timeline for negotiation before signing",
      "",
      "Be specific about actual contract language and its implications. Do not provide legal advice; frame as business risk analysis.",
    ].join("\n");

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are an expert contract attorney and business strategist specializing in SaaS, technology, and partnership agreements." },
        { role: "user", content: userContent },
      ],
      max_tokens: 1400,
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Contract summary generation failed." }, { status: 500 });
  }
}
