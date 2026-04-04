import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { recipient, relationship, occasion, interests, budget, extra } = await req.json();

    if (!recipient || !occasion) {
      return NextResponse.json({ error: "Recipient and occasion are required." }, { status: 400 });
    }

    const prompt = `You are a thoughtful gift expert. Recommend perfect gifts based on the following:

RECIPIENT: ${recipient}
RELATIONSHIP TO YOU: ${relationship || "Friend"}
OCCASION: ${occasion}
WHAT YOU KNOW ABOUT THEIR INTERESTS: ${interests || "Not specified"}
BUDGET: ${budget || "Not specified"}
ANY OTHER DETAILS: ${extra || "None"}

Provide a structured gift recommendation list:

## 🎁 Gift Recommendations
For each gift, include: name, brief description (why it's perfect), estimated price range, and where to buy it (e.g. Amazon, Etsy, etc.)

## 💡 Alternative Ideas
2-3 more options across different price points.

## 🎀 Wrapping & Presentation
Suggest how to present the gift for maximum impact.

## 📝 Personal Touch
A suggestion for a handwritten card message or extra personalization.

Be warm, creative, and practical. Show you understand the relationship and occasion.`;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 900,
      temperature: 0.8,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: "Failed to generate recommendations." }, { status: 500 });
  }
}
