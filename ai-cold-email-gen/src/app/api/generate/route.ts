import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { product, targetPerson, targetRole, company, painPoint, offer, cta, tone, numVariants } = await req.json();
    if (!product?.trim()) {
      return NextResponse.json({ error: "Product/service name is required." }, { status: 400 });
    }

    const userContent = [
      "Write complete cold email outreach sequences for:",
      "",
      "**Your Product/Service:** " + (product || "AI-powered project management tool"),
      "**Target Person:** " + (targetPerson || "John Smith, VP of Operations"),
      "**Their Role:** " + (targetRole || "VP of Operations at mid-market SaaS companies"),
      "**Company Description:** " + (company || "Mid-market SaaS companies (50-200 employees) growing fast but struggling with team coordination"),
      "**Their Pain Point:** " + (painPoint || "Teams are working in silos, priorities shift constantly, and there's no single source of truth for projects"),
      "**Your Offer:** " + (offer || "A 30-minute consultation to show how NovaTask can give their team a single source of truth in under 2 weeks"),
      "**Call to Action:** " + (cta || "Schedule a 30-min call this week"),
      "**Tone:** " + (tone || "Genuine, curious, value-first — not pushy or salesy"),
      "**Number of Variants:** " + (numVariants || "3 completely different approaches/angles"),
      "",
      "Generate ALL of the following:",
      "",
      "## Email 1: The Cold Outbound",
      "Subject line options (5 variants):",
      "- Question hook",
      "- Curiosity gap",
      "- Data/stat hook",
      "- Personalized (with company detail)",
      "- Ultra-short / casual",
      "",
      "Then the email body:",
      "- Opening line: Why you are reaching out specifically to them (1 sentence)",
      "- Problem acknowledgment: Show you understand their world (1-2 sentences)",
      "- Proof of the problem: A stat, observation, or customer story (1 sentence)",
      "- Your solution: How you solve it specifically (2-3 sentences)",
      "- Social proof: 1 credential or customer result",
      "- CTA: Specific, easy, low-commitment",
      "",
      "## Email 2: The Follow-up (3-5 days later)",
      "Subject + body. Different angle — add new value, not just \"checking in.\"",
      "",
      "## Email 3: The Breakup Email (10-14 days later)",
      "Subject + body. Final attempt, softer close or give them an out — but keep it compelling.",
      "",
      "## Variant B (completely different angle)",
      "Repeat Emails 1-3 but from a completely different angle (e.g., if variant A was problem-aware, variant B should be solution-aware or outcome-led).",
      "",
      "## Variant C (completely different angle)",
      "Repeat Emails 1-3 from a third angle (e.g., story-led, question-led, or authority-led).",
      "",
      "## Subject Line Formulas",
      "5 reusable formulas for writing subject lines that get opens:",
      "- [Number] + [Outcome]",
      "[Curiosity question about their role]",
      "[Company name] + [Pain point]",
      "[Their industry] + [Specific trend]",
      "Re: [Mutual connection or trigger event]",
      "",
      "## Personalization Tips",
      "Where and how to personalize these emails for maximum relevance:",
      "- LinkedIn profile signals",
      "- Company website signals",
      "- Trigger events",
      "- Mutual connections",
      "",
      "Write each email to feel genuinely personal and thoughtful — not mass outreach. Include specific placeholders for personalization.",
    ].join("\n");

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are an expert cold outreach copywriter. Write emails that feel personal, get opened, and spark genuine interest." },
        { role: "user", content: userContent },
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
