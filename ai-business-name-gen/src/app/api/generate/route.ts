import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { businessIdea, industry, vibe, includeDomain } = await req.json();

    if (!businessIdea) {
      return NextResponse.json({ error: "Please describe your business idea." }, { status: 400 });
    }

    const domainHint = includeDomain
      ? `\n## 🌐 Domain Availability Hints
For each name, suggest: .com, .co, .io variants and note approximate availability (likely taken, probably available, etc.).`
      : "";

    const prompt = `You are a branding expert and startup naming specialist. Generate creative, memorable business name ideas for the following small business:

BUSINESS IDEA / PRODUCT: ${businessIdea}
INDUSTRY / NICHE: ${industry || "General"}
BRAND VIBE: ${vibe || "Professional and trustworthy"}
${domainHint}

Generate a structured response:

## ✨ Business Name Ideas
Provide 10 unique business name options. For each include:
- **Name** (bold)
- **Tagline** (short, catchy phrase)
- **Why it works** (1 sentence)
- **Domain idea** (e.g. thefoundry.co)

## 🏷️ Tagline Collection
A bonus list of 5 powerful taglines that could work across multiple names.

## 🎯 Name Style Guide
Suggest the best naming style for this type of business (e.g. descriptive, evocative, invented word, initials, etc.).

Make names memorable, easy to pronounce, and suitable for a small business. Avoid trademarked terms.`;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
      temperature: 0.85,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: "Failed to generate names." }, { status: 500 });
  }
}
