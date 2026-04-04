import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { jobTitle, level, includeTechnical, includeBehavioral, includeSituational } = await req.json();

    if (!jobTitle) {
      return NextResponse.json({ error: "Please provide a job title." }, { status: 400 });
    }

    const sections: string[] = [];
    const prompts: string[] = [];

    if (includeBehavioral) {
      prompts.push(`**Behavioral Questions** (STAR method):
For each question, briefly indicate what competency it assesses.
Q1: [behavioral question] (Assesses: [competency])
Q2: ...`);
    }

    if (includeSituational) {
      prompts.push(`**Situational Questions**:
Q1: [situational question] (Scenario: [brief context])
Q2: ...`);
    }

    if (includeTechnical) {
      prompts.push(`**Technical Questions** for a ${jobTitle} (${level || "mid-level"}):
Q1: [technical question]
Q2: ...`);
    }

    if (prompts.length === 0) {
      return NextResponse.json({ error: "Select at least one question type." }, { status: 400 });
    }

    const prompt = `You are an expert interview coach. Generate interview questions for the following role.

**Job Title:** ${jobTitle}
**Experience Level:** ${level || "Mid-level"}
${includeBehavioral ? "Include 5 behavioral questions using the STAR method." : ""}
${includeSituational ? "Include 4 situational/case questions." : ""}
${includeTechnical ? `Include 5 technical questions relevant to a ${jobTitle} role.` : ""}

Format as:

**Behavioral Questions** (${includeBehavioral ? "5 questions" : "not requested"}):
1. [question] (Assesses: [competency])

**Situational Questions** (${includeSituational ? "4 questions" : "not requested"}):
1. [question] (Scenario: [context])

**Technical Questions** (${includeTechnical ? "5 questions" : "not requested"}):
1. [question]

Return ONLY the questions, nothing else.`;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are a senior HR professional and interview coach with 15+ years of experience. Your questions reveal actual competence, not rehearsed answers.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1200,
    });

    const questions = completion.choices[0]?.message?.content;

    if (!questions) {
      return NextResponse.json({ error: "Failed to generate questions." }, { status: 500 });
    }

    return NextResponse.json({ questions });
  } catch (error: unknown) {
    console.error("Questions generation error:", error);
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
