import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { currentProduct, customerProfile, purchaseHistory } = await req.json();
    if (!currentProduct?.trim()) {
      return NextResponse.json({ error: "Current product is required." }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert revenue growth strategist specializing in upsell and cross-sell strategies for SaaS businesses.`,
        },
        {
          role: "user",
          content: `Generate upsell and cross-sell recommendations for:

**Current Product/Subscription:** ${currentProduct}
**Customer Profile:** ${customerProfile || "Current paying customer"}
**Purchase History:** ${purchaseHistory || "Standard customer journey"}

Generate ALL of the following:

## 1. Upsell Recommendations (3 options)

For each upsell option provide:
- **Upgrade name**
- **Target customer segment** (who benefits most)
- **Pricing recommendation** (how much to charge)
- **Positioning** (how to frame it — benefit-led)
- **Conversion angle** (why they'd say yes)
- **Expected conversion lift** (realistic %)

## 2. Cross-Sell Recommendations (3 options)

For each cross-sell provide:
- **Product/service to cross-sell**
- **Why it pairs naturally** (complementary fit)
- **How to bundle it** (discount, package deal, or standalone)
- **Positioning and messaging**
- **Expected conversion lift**

## 3. Personalized Recommendation Logic

For each customer segment provide:
- **Segment:** [e.g., Power Users]
- **Trigger behavior:** [what they do that signals readiness]
- **Best offer:** [specific upsell or cross-sell]
- **Timing:** [when to make the offer]
- **Channel:** [in-app, email, or both]

Segments to cover:
- High-usage customers approaching plan limits
- Long-term customers on legacy pricing
- Customers who haven't used key features
- Customers who consistently hit usage caps

## 4. Recommended Pricing Anchors

For the upsells/cross-sells recommended above:
- **Good / Better / Best framing** (3 tiers)
- **Anchor price** (highest tier to anchor perception)
- **Decoy effect** (middle option designed to sell top)

## 5. Outreach Templates

### In-App Upgrade Prompt
Copy for an in-app upgrade banner or modal.

### Email Upsell Template
Subject + 3-sentence body + CTA.

### Cross-Sell Email Template
Subject + 3-sentence body + CTA (for a complementary product).

## 6. Implementation Notes
- When to trigger each recommendation (behavioral triggers)
- A/B test priorities (which offer to test first)
- Expected ROI considerations

Be specific. Recommend realistic upgrade prices and conversion lifts based on SaaS benchmarks.`,
        },
      ],
      max_tokens: 1200,
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Recommendation generation failed." }, { status: 500 });
  }
}
