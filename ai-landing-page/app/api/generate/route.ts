import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const { product, audience } = await req.json();
    if (!product?.trim()) {
      return NextResponse.json({ error: "Product description is required" }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://api.deepseek.com/v1",
    });

    const audStr = audience || "General audience";
    const prompt = `You are an expert landing page copywriter and conversion rate optimizer. Generate high-converting landing page copy.

Product: ${product}
Target Audience: ${audStr}

Please generate:
1. **Hero Section**
   - Headline (primary): [Compelling headline]
   - Subheadline: [Supporting message]
   - CTA Button: [Call to action text]
   - Hero supporting copy: [2-3 sentences elaborating the value prop]
2. **Social Proof Bar** - Testimonials/quotes/philanthropy logos
3. **Problem Section** - Headline + copy describing the pain point
4. **Solution Section** - How the product solves it
5. **Features/Benefits Section** - 3-4 key benefits with headlines
6. **How It Works Section** - 3-step process
7. **Pricing/Upsell Section** - Plan names, prices, key features
8. **FAQ Section** - 3-4 common objections answered
9. **Final CTA Section** - Closing argument + CTA
10. **Conversion Optimization Notes** - A/B testing suggestions for headlines and CTAs

Make the copy punchy, benefit-focused, and conversion-optimized.`;

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are an expert landing page copywriter and conversion rate optimization specialist.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 3000,
    });

    const result = completion.choices[0]?.message?.content || "No copy generated.";
    return NextResponse.json({ result });
  } catch (err: unknown) {
    console.error("Generation error:", err);
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
