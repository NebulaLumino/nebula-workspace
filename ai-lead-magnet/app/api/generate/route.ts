import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const { audience, topic } = await req.json();
    if (!audience?.trim()) {
      return NextResponse.json({ error: "Target audience is required" }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://api.deepseek.com/v1",
    });

    const topicStr = topic || "General topic";
    const prompt = `You are a content marketing and lead generation expert. Generate lead magnet ideas and content outlines.

Target Audience: ${audience}
Content Topic: ${topicStr}

Please generate:
1. **Lead Magnet Ideas** (at least 8 options):
   - Type: [Checklist/Template/Cheat Sheet/Guide/Mini-course/etc.]
   - Title: [Specific, benefit-driven title]
   - Conversion Rationale: [Why this audience would exchange their email for this]
2. **Top Pick: Detailed Content Outline** - Full outline for the #1 recommended lead magnet
   - Introduction hook
   - Section 1: [Topic] with sub-points
   - Section 2: [Topic] with sub-points
   - Section 3: [Topic] with sub-points
   - Conclusion / Call to Action
3. **Landing Page Copy** for the lead magnet:
   - Headline
   - Subheadline
   - Bulleted benefits (why download)
   - CTA button text
4. **Email Swipe Copy** - Subject line + body for the delivery email
5. **Distribution Strategy** - Where and how to promote this lead magnet

Make each lead magnet type concrete and specific. Avoid generic titles.`;

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are an expert content marketing strategist and lead generation specialist.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 2800,
    });

    const result = completion.choices[0]?.message?.content || "No ideas generated.";
    return NextResponse.json({ result });
  } catch (err: unknown) {
    console.error("Generation error:", err);
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
