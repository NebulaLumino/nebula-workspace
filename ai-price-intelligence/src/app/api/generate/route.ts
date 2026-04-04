import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { yourProduct, competitors, marketPosition, pricingModel, targetCustomer } = await req.json();
    if (!yourProduct?.trim()) {
      return NextResponse.json({ error: "Your product is required." }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert pricing strategist and competitive intelligence analyst specializing in B2B SaaS and tech products.`,
        },
        {
          role: "user",
          content: `Generate a comprehensive competitor price intelligence report for:

**Your Product:** ${yourProduct}
**Competitors:** ${competitors || "Top 3-5 direct competitors in your space"}
**Current Market Position:** ${marketPosition || "Mid-market SaaS, growing, differentiating on UX and integrations"}
**Your Pricing Model:** ${pricingModel || "Subscription (monthly + annual), tiered per user or per seat"}
**Target Customer:** ${targetCustomer || "SMB to mid-market, 10-500 employees, $50K-$5M revenue"}

Generate ALL of the following:

## 1. Competitive Pricing Landscape Overview

For each competitor listed (or top 5 in the space), provide:
- **Starting price** (entry-level plan)
- **Mid-tier price** (most popular plan)
- **Enterprise price** (custom/unlimited)
- **Pricing model** (per user, per feature, flat rate, usage-based, hybrid)
- **Free trial / freemium** (yes/no, duration)
- **Annual discount** (% offered for annual commitment)
- **Notable pricing tactics** (add-ons, usage caps, seat minimums)

## 2. Price Positioning Matrix

| Competitor | Entry Price | Mid Price | Enterprise | Model Type | Free Tier |
|------------|-------------|-----------|------------|------------|-----------|
| [Your Product] | $X/mo | $X/mo | $X/mo | ... | ... |
| Competitor A | ... | ... | ... | ... | ... |
| Competitor B | ... | ... | ... | ... | ... |
| Competitor C | ... | ... | ... | ... | ... |
| Competitor D | ... | ... | ... | ... | ... |

Visual analysis: where is the market crowded? where are gaps?

## 3. Value Metric Analysis

- **What each competitor charges per** (per user, per API call, per GB, flat)
- **Which value metric aligns best** with customer ROI
- **Value metric recommendation** for ${yourProduct} (what to charge for to maximize conversion)
- **Usage-based vs flat pricing** analysis — pros/cons for each model in this market

## 4. Pricing Gap Analysis

- Where your pricing sits relative to the market (underpriced, aligned, premium)
- Where competitors are vulnerable (overpriced for what they deliver)
- Where competitors are undercutting (aggressive pricing to gain share)
- Pricing sweet spots in the market that aren't being served

## 5. Competitive Pricing Reactions

If you were to adjust your pricing, model the likely competitive responses:
- If you lower price → how do competitors react
- If you raise price → how do competitors react  
- If you add a new tier → where is the gap
- Risk of price war in this category

## 6. Recommended Pricing Strategy for ${yourProduct}

### Current State
- Where you should price relative to competitors
- Whether to position as premium, competitive, or value leader

### Tier-by-Tier Recommendations

#### Starter / Entry Tier
- Recommended price
- What features to include
- Who this is for
- How it compares to competitor equivalents

#### Pro / Mid Tier
- Recommended price
- Key differentiators vs competitor mid-tiers
- Feature bundle strategy
- Sweet spot for conversion

#### Enterprise / Unlimited Tier
- Recommended price floor
- What's included (SSO, SLAs, dedicated support, etc.)
- Custom pricing triggers (when to go custom)
- How to justify premium vs competitors

## 7. Feature-for-Feature Comparison

Build a feature matrix:
| Feature | [Your Product] | Competitor A | Competitor B | Competitor C |
|---------|---------------|-------------|-------------|-------------|
- 15-20 key features across categories (core, advanced, enterprise)
- Where you lead, where you lag, where parity exists

## 8. Win/Loss Pricing Scenarios

Real examples of how pricing impacts deals:
- **Scenario 1:** Customer choosing between you and Competitor A at same price — how to win
- **Scenario 2:** Customer choosing between you (higher price) and Competitor B — how to justify premium
- **Scenario 3:** Customer choosing between you (lower price) and Competitor C — how to avoid race to bottom
- **Scenario 4:** Enterprise deal where budget is constrained — how to structure

## 9. Bundling & Packaging Opportunities

- Features currently separated that could be bundled
- New tier opportunities (e.g., "Team" vs "Business" split)
- Add-on pricing opportunities
- Packaging to avoid feature comparison shopping

## 10. Market Pricing Signals & Sentiment

- Are competitors recently changed pricing (raises, cuts, new tiers)
- Industry trend (moving toward usage-based, value metrics, etc.)
- Seasonality in pricing decisions (when do buyers expect discounts)
- Economic factors affecting pricing power in this category

## 11. Action Plan: Next 90 Days

Priority actions ranked:
1. Immediate (this month)
2. Short-term (next quarter)
3. Medium-term (6 months)

Be specific with numbers. Reference real pricing patterns in B2B SaaS. Don't be vague — every recommendation should have a dollar figure attached.`,
        },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Price intelligence report generation failed." }, { status: 500 });
  }
}
