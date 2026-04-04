import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { brandName, productService, targetInfluencer, influencerType, collaborationType, budget, platform } = await req.json();
    if (!brandName?.trim() || !productService?.trim()) {
      return NextResponse.json({ error: "Brand name and product/service are required." }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert influencer marketing strategist and cold outreach copywriter.`,
        },
        {
          role: "user",
          content: `Generate influencer outreach email sequences for:

**Brand Name:** ${brandName}
**Product/Service to Promote:** ${productService}
**Target Influencer (name or handle):** ${targetInfluencer || "Top-tier micro-influencer in your niche"}
**Influencer Type:** ${influencerType || "Micro-influencer (10K-100K followers), niche content creator"}
**Collaboration Type:** ${collaborationType || "Sponsored post, product seeding, affiliate partnership, brand ambassadorship"}
**Budget Range:** ${budget || "$500-$2,000 per post or revenue share"}
**Platform:** ${platform || "Instagram, YouTube, or TikTok"}

Generate ALL of the following:

## 1. Cold Outreach Email Sequence (3 Emails)

### Email 1: Initial Pitch
- **Subject lines** (5 options — personalized, specific, not generic)
- **Preview text**
- **Email body** (150-200 words — why THEM specifically, what you admire, the specific opportunity)
- **CTA** (what to do next)
- **Follow-up timing** (when to send if no reply)

### Email 2: Value Reinforcement (If no reply after 4-5 days)
- **Subject lines** (5 options)
- **Email body** (remind them of the value, add social proof, lower friction)
- **CTA**

### Email 3: Closing / Alternative Ask (If no reply after 8-10 days)
- **Subject lines** (5 options)
- **Email body** (softer close, open to alternatives — product seed, affiliate link, smaller scope)
- **CTA**

## 2. Influencer Tier Strategy

Define outreach approach for each tier:

### Nano-Influencers (1K-10K)
- Compensation range
- Messaging tone
- What to offer (product gifting vs paid)
- Conversion expectations
- Best platforms

### Micro-Influencers (10K-100K)
- Compensation range
- Messaging tone
- What to offer (paid vs affiliate)
- Conversion expectations
- Best platforms

### Mid-Tier Influencers (100K-500K)
- Compensation range
- Messaging tone
- What to offer (paid campaigns, long-term)
- Conversion expectations
- Best platforms

### Macro Influencers (500K-1M+)
- Compensation range
- Messaging tone
- What to offer (major campaigns, exclusivity)
- Conversion expectations
- Best platforms

## 3. Platform-Specific Adaptation

For each platform (Instagram, YouTube, TikTok):
- Subject line tweaks (if email) or DM opening lines
- Content format preferences (Reels vs Stories vs Posts)
- Messaging tone differences
- Platform-specific compliance notes (FTC disclosures)

## 4. Collaboration Offer Templates

### Sponsored Post Offer
Full brief including: deliverables, posting schedule, key messaging points, hashtag requirements, CTA, exclusivity clause, compensation.

### Product Seeding / Gifting Package
What to send, what to ask for, follow-up expectations, usage rights.

### Affiliate / Revenue Share Program
Commission structure, cookie duration, creative assets provided, reporting cadence.

### Long-Term Brand Ambassador Contract
6-month and 12-month terms with deliverables, compensation milestones, exclusivity, and brand fit requirements.

## 5. Personalized Icebreakers

20 specific, personalized opening lines based on actual influencer content you could reference:
- Comment on a specific post of theirs
- Reference a collaboration they did with a competitor
- Reference a personal story they shared
- Reference their audience or niche specialization

## 6. Negotiation Talking Points

When influencers push back on price:
- 5 specific responses with language to use
- What to offer instead of reducing price (more product, exclusivity, affiliate, content rights)
- When to walk away

## 7. Compliance & Legal Checklist

- FTC disclosure requirements by platform
- What to include in contracts
- Content usage rights (resharing, paid media, etc.)
- Exclusivity clauses
- Performance guarantees

## 8. Metrics to Track Post-Launch

| Metric | Target | How to Track |
|--------|--------|--------------|
- Track per influencer, per platform, per campaign

Be personal, specific, and reference real details. No generic templates — make every email feel like it was written for that specific influencer.`,
        },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Email generation failed." }, { status: 500 });
  }
}
