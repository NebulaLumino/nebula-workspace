import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { productName, customerType, npsScore, painPoint, tone, language } = await req.json();
    if (!productName?.trim()) {
      return NextResponse.json({ error: "Product name is required." }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert email copywriter specializing in customer success and NPS follow-up sequences.`,
        },
        {
          role: "user",
          content: `Generate NPS follow-up email sequences for the following product/service:

**Product/Service:** ${productName}
**Customer Type:** ${customerType || "General B2B SaaS customers"}
**NPS Score Context:** ${npsScore ? `Targeting customers with NPS score: ${npsScore}` : "General NPS follow-up"}
**Primary Pain Point to Address:** ${painPoint || "Product usability, pricing, feature gaps, or support experience"}
**Tone:** ${tone || "Warm, empathetic, conversational"}
**Language:** ${language || "English"}

Generate ALL of the following:

## 1. Detractor Response Sequence (NPS 0-6) — 3 Emails
These customers are unhappy. Your goal is to understand why, apologize where needed, and either win them back or gracefully exit.

### Email 1: Acknowledgment + Empathy (Send immediately)
- **Subject line** (3 options — punchy, curiosity-driven)
- **Preview text**
- **Email body** (4-6 sentences max — personal, not corporate)
- **CTA** (what should they do next)

### Email 2: Problem-Solving Outreach (Send 3-5 days later if no reply)
- **Subject line** (3 options)
- **Preview text**
- **Email body** (acknowledge their silence, offer specific help)
- **CTA**

### Email 3: Win-Back or Graceful Exit (Send 7-10 days later if no reply)
- **Subject line** (3 options)
- **Preview text**
- **Email body** (offer compensation or clear offboarding, no guilt)
- **CTA**

## 2. Passive Response Sequence (NPS 7-8) — 2 Emails
These customers are satisfied but not thrilled. Your goal is to move them to promoters.

### Email 1: Asking for Detail (Send immediately)
- **Subject line** (3 options — specific, not generic)
- **Preview text**
- **Email body** (thank them, dig into what would make it a 9-10)
- **CTA**

### Email 2: Personalized Activation (Send 5-7 days later)
- **Subject line** (3 options)
- **Preview text**
- **Email body** (connect to their specific use case, suggest a "next step")
- **CTA**

## 3. Promoter Follow-Up (NPS 9-10) — 2 Emails
These are your advocates. Maximize their impact.

### Email 1: Thank You + Ask for Referral (Send immediately)
- **Subject line** (3 options — genuine excitement, not salesy)
- **Preview text**
- **Email body** (specific thank you, subtle ask for referral/review)
- **CTA** (specific: link to G2, referral program, social share)

### Email 2: Stay-Connected Nurture (Send 2-3 weeks later)
- **Subject line** (3 options)
- **Preview text**
- **Email body** (share a win, feature update, or community story)
- **CTA**

## 4. Segment-Specific Variations

Provide alternate email versions for each segment:
- **Enterprise customers** (longer, more formal, multi-stakeholder)
- **Freelance/SMB customers** (shorter, casual, value-focused)
- **Free/trial users** (low-friction, ask for feedback, upgrade path)

## 5. Subject Line Bank
List 10 high-performing subject lines across all NPS segments.

## 6. Best Practices Checklist
- Optimal send times
- Email length guidelines per segment
- Subject line character limits
- A/B test priorities
- Compliance notes (CAN-SPAM, GDPR)

Be specific with names, companies, and CTAs. Make emails feel human, not templated.`,
        },
      ],
      max_tokens: 1400,
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Email generation failed." }, { status: 500 });
  }
}
