import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { topic, difficulty, count } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Please provide a quiz topic." }, { status: 400 });
    }

    const difficultyInstruction =
      difficulty === "easy"
        ? "Make questions straightforward and accessible to most people."
        : difficulty === "hard"
        ? "Make questions challenging — require deep knowledge or obscure facts."
        : "Mix of straightforward and challenging questions.";

    const prompt = `You are a trivia quiz master. Generate a fun, accurate multiple-choice trivia quiz.

**Topic:** ${topic}
**Difficulty:** ${difficulty || "medium"} — ${difficultyInstruction}
**Number of questions:** ${count || 10}

Generate exactly ${count || 10} multiple-choice trivia questions.

Format each question like this:
Q1: [Question text]
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]
ANSWER: [Correct letter]

Rules:
- Each question must have exactly 4 options (A, B, C, D)
- Only ONE correct answer per question
- Questions should be factual and accurate
- Vary the difficulty within the specified level
- Make wrong answers plausible but clearly wrong
- Questions should be fun and interesting, not just trivia trivia

Return ONLY the quiz in the exact format above, nothing else.`;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are a trivia expert who writes accurate, fun, and challenging quiz questions. Your wrong answers should be plausible distractors, not obviously wrong.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const quiz = completion.choices[0]?.message?.content;

    if (!quiz) {
      return NextResponse.json({ error: "Failed to generate quiz." }, { status: 500 });
    }

    return NextResponse.json({ quiz });
  } catch (error: unknown) {
    console.error("Quiz generation error:", error);
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
