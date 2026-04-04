import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const { product, journey } = await req.json();
    if (!product?.trim()) {
      return NextResponse.json({ error: "Product description is required" }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://api.deepseek.com/v1",
    });

    const journeyStr = journey || "Standard SaaS onboarding";
    const prompt = `You are an email marketing specialist for SaaS companies. Generate an onboarding email sequence.

SaaS Product: ${product}
User Journey: ${journeyStr}

Please generate:
1. **Onboarding Sequence Overview** - Number of emails, timing, goal of each
2. **Email 1: Welcome & Setup** - Subject, preheader, body copy, CTA
3. **Email 2: Core Feature Activation** - Getting the "aha moment"
4. **Email 3: Value Reinforcement** - Showing results/data from using the product
5. **Email 4: Tip & Trick** - Deeper engagement with the product
6. **Email 5: Social Proof / Success Story** - Peer/customer success
7. **Email 6: Milestone Check-in** - 30-day checkpoint
8. **Activation Milestones** - What actions indicate successful onboarding?
9. **Engagement Tips** - How to keep users engaged between emails

For each email include: subject line, preview text, body copy with personalization tokens, and CTA.`;

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are an expert SaaS email marketing specialist specializing in onboarding and activation sequences.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2800,
    });

    const result = completion.choices[0]?.message?.content || "No sequence generated.";
    return NextResponse.json({ result });
  } catch (err: unknown) {
    console.error("Generation error:", err);
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
