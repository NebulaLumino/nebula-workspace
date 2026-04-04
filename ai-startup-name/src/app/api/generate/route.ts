import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const { concept, keywords, industry } = await req.json();

    if (!concept?.trim()) {
      return NextResponse.json({ error: "Product concept is required" }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://api.deepseek.com/v1",
    });

    const keywordStr = keywords || "not specified";
    const industryStr = industry || "not specified";

    const prompt = `You are an expert startup naming consultant. Generate a comprehensive list of startup name options based on the following product concept.

Product Concept: ${concept}
Keywords: ${keywordStr}
Industry/Sector: ${industryStr}

Please generate:
1. At least 15 creative startup name options with brief explanations of what makes each name effective
2. For each name, suggest 3-5 available domain extensions (.com, .io, .co, .ai, .app, .tech) with availability notes
3. Trademark/brandability considerations for the top 5 names
4. Naming conventions that would work well for this type of startup
5. A brief note on naming pitfalls to avoid for this space

Format your response with clear markdown headers and bullet points.`;

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are an expert startup naming consultant with deep knowledge of branding, domains, trademarks, and startup naming trends.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.85,
      max_tokens: 3000,
    });

    const result = completion.choices[0]?.message?.content || "No names generated.";
    return NextResponse.json({ result });
  } catch (err: unknown) {
    console.error("Generation error:", err);
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
