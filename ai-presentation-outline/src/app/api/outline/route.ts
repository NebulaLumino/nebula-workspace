import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { topic, audience, duration, presentationType } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Please provide a presentation topic." }, { status: 400 });
    }

    const slideCount =
      duration <= 5 ? 5
      : duration <= 10 ? 8
      : duration <= 20 ? 12
      : 15;

    const typeInstruction =
      presentationType === "pitch"
        ? "This is a pitch/deck — persuasive, concise, visually driven slides."
        : presentationType === "educational"
        ? "This is an educational presentation — clear explanations, examples, and learning outcomes."
        : presentationType === "keynote"
        ? "This is a keynote speech — inspirational, narrative-driven, memorable."
        : "This is a business presentation — structured, professional, data-friendly.";

    const prompt = `You are an expert presentation designer and public speaking coach. Create a compelling presentation outline.

**Topic:** ${topic}
**Target Audience:** ${audience || "General professional audience"}
**Duration:** ${duration || 10} minutes
**Type:** ${typeInstruction}

Create a ${slideCount}-slide presentation outline:

For each slide, provide:
- Slide Title
- Key talking points (3-5 bullets)
- A suggested visual or graphic element
- Timing for that slide

Format as:

**Slide 1: [Title]** (~X min)
- Talking point 1
- Talking point 2
- 💡 Visual: [suggestion]

**Slide 2: [Title]** ...and so on

Include:
- Slide 1: Strong opening hook
- Slide 2-3: Context and problem/opportunity
- Middle slides: Core content (3-5 slides of key points)
- Near-end: Call to action or key takeaway
- Final slide: Memorable close + thank you

Return ONLY the outline in the format above.`;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are a world-class presentation designer. Your outlines are clear, compelling, and structured for maximum audience impact.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const outline = completion.choices[0]?.message?.content;

    if (!outline) {
      return NextResponse.json({ error: "Failed to generate outline." }, { status: 500 });
    }

    return NextResponse.json({ outline });
  } catch (error: unknown) {
    console.error("Outline generation error:", error);
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
