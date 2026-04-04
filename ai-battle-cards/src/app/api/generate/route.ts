import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { yourProduct, competitors, targetAudience, dealStage, productCategory } = await req.json();
    if (!yourProduct?.trim()) {
      return NextResponse.json({ error: "Your product name is required." }, { status: 400 });
    }

    const userContent = [
      "Generate a comprehensive competitive battle card package for:",
      "",
      "**Your Product:** " + (yourProduct || "My Product"),
      "**Competitors:** " + (competitors || "Main competitors to compete against"),
      "**Target Audience:** " + (targetAudience || "Sales reps, SDRs, account executives"),
      "**Deal Stage:** " + (dealStage || "Early-stage evaluation, shortlist, final eval, renewal"),
      "**Product Category:** " + (productCategory || "SaaS / Technology"),
      "",
      "Generate ALL of the following:",
      "",
      "## 1. Executive Summary",
      "- Your product's competitive positioning in one paragraph",
      "- The #1 thing that differentiates you from competitors",
      "- The #1 vulnerability competitors will try to exploit",
      "",
      "## 2. Competitor Profiles",
      "For each competitor provide:",
      "- Company overview and positioning",
      "- Strengths (what they do well, why they win)",
      "- Weaknesses (what they do poorly, why they lose)",
      "- Pricing model and strategy",
      "- Target customer segment",
      "- Most common objection when competing against them",
      "",
      "## 3. Competitive Positioning Matrix",
      "| Category | Your Product | Competitor A | Competitor B | Competitor C |",
      "| Feature A | --- | --- | --- | --- |",
      "... (comprehensive feature comparison)",
      "",
      "## 4. Battle Cards by Competitor",
      "For each competitor provide a dedicated battle card with:",
      "- How to OPEN against them (what to say first)",
      "- Their #1 weakness to exploit",
      "- Their #1 strength to acknowledge (don't deny)",
      "- 3 talking points to use against them",
      "- 3 objections they raise + winning responses",
      "- Closing line (what to say to win)",
      "",
      "## 5. Common Objection Handling",
      "For the top objections sales reps face:",
      "[Objection] vs [Your counter]",
      "Give 8-10 real objections with specific, winning responses.",
      "",
      "## 6. Competitive Intelligence Talking Points",
      "- What stats/numbers to have ready (pricing, performance, market share)",
      "- Third-party validation to cite (reviews, analyst reports, awards)",
      "- Customer proof points to reference by competitor",
      "",
      "## 7. Win Themes by Deal Stage",
      "- Early evaluation: lead with X",
      "- Shortlist stage: differentiate on Y",
      "- Final eval: close on Z",
      "- Renewal: protect against competitive threat with W",
      "",
      "## 8. Competitive Pricing Strategy",
      "- Where to position your price vs competitors",
      "- How to handle \"Competitor X is cheaper\" objections",
      "- How to handle \"Competitor X has more features\" objections",
      "- When to discount and when not to",
      "",
      "## 9. Sales Playbook Notes",
      "- Discovery questions to ask to uncover competitor evaluations",
      "- How to disqualify a competitor early",
      "- Land-and-expand competitive motion",
      "- How to handle when you are the incumbent and competitor is pitching",
      "",
      "## 10. Battle Card Quick Reference Card",
      "One-page summary for sales reps:",
      "- Top 3 competitors and one-line positioning for each",
      "- Top 3 objections + one-line responses",
      "- Top 3 competitive proof points",
      "",
      "Make this actionable for real sales conversations. Include specific language reps can use verbatim.",
    ].join("\n");

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are an expert competitive intelligence analyst and sales enablement specialist." },
        { role: "user", content: userContent },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Battle card generation failed." }, { status: 500 });
  }
}
