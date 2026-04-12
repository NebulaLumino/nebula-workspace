import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const { researchSummary, conference, wordLimit } = await req.json();

  if (!researchSummary || researchSummary.trim().length < 20) {
    return NextResponse.json({ error: "Please provide a research summary." }, { status: 400 });
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://api.deepseek.com/v1",
  });

  const systemPrompt = `You are an expert academic conference organizer and science communicator. Generate a formatted, optimized conference abstract tailored to the specific conference and word limit.

Follow this format:

# Optimized Conference Abstract

## Conference: [Target Conference]
## Word Count: [Target word count]

## Abstract Text
[Structured abstract following conference conventions. Typically includes: Background/Aim, Methods, Results, Conclusion. Written in third person past tense, active voice where appropriate. Tight, compelling, no filler.]

## Plain-Language Impact Statement
[1-sentence plain-language summary of the main takeaway for a general scientific audience]

## Reviewer Angles
[2-3 talking points about what will make reviewers interested: novelty, impact, methodology]

## Title Options
[3 suggested titles ranked by appeal to reviewers]

${wordLimit ? `Note: Target word limit is ${wordLimit} words. The abstract has been optimized to fit within this limit.` : ''}

Be concise, compelling, and conference-ready. Start with the most important information. Avoid jargon. Make the impact clear in the first two sentences.`;

  const userPrompt = `Research Summary: ${researchSummary}
Target Conference: ${conference || "General scientific conference"}
Word Limit: ${wordLimit || "Not specified"}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.6,
      max_tokens: 2000,
    });

    const result = completion.choices[0]?.message?.content || "No response generated.";
    return NextResponse.json({ result });
  } catch (error: unknown) {
    console.error("DeepSeek API error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
