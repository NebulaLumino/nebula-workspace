import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const { vision, constraints, team } = await req.json();
    if (!vision?.trim()) {
      return NextResponse.json({ error: "Product vision is required" }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://api.deepseek.com/v1",
    });

    const constStr = constraints || "Not specified";
    const teamStr = team || "Not specified";
    const prompt = `You are an expert product manager specializing in MVP development. Generate a prioritized MVP feature list and scope plan.

Product Vision: ${vision}
Constraints (time, budget, tech): ${constStr}
Team Size & Skills: ${teamStr}

Please generate:
1. **MVP Core Value Proposition** - The one thing the MVP must prove
2. **MoSCoW Prioritization** - Features broken into Must-have, Should-have, Could-have, Won't-have
3. **Sprint/Phase Breakdown** - How to phase the development
4. **Scope Estimates** - Complexity/size estimate for each feature
5. **Out of Scope** - What to explicitly exclude
6. **Success Metrics** - What metrics will validate the MVP hypothesis?
7. **Risk Assessment** - Key technical or product risks

Format with clear headers and prioritization rationale.`;

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are an expert product manager specializing in MVP development and agile scoping.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const result = completion.choices[0]?.message?.content || "No scope plan generated.";
    return NextResponse.json({ result });
  } catch (err: unknown) {
    console.error("Generation error:", err);
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
