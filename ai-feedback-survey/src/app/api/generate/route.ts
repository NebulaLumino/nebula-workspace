import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
const client = new OpenAI({ baseURL: "https://api.deepseek.com/v1", apiKey: process.env.DEEPSEEK_API_KEY || "" });

export async function POST(req: NextRequest) {
  try {
    const { teamType, teamSize, surveyGoal, anonymity, frequency } = await req.json();
    if (!teamType?.trim()) return NextResponse.json({ error: "Team type is required." }, { status: 400 });

    const userContent = [
      "Generate a comprehensive team feedback survey package:",
      "",
      "**Team Type:** " + (teamType || "Engineering team, cross-functional product team, remote/hybrid, executive team"),
      "**Team Size:** " + (teamSize || "12 people"),
      "**Survey Goal:** " + (surveyGoal || "Understand engagement, identify pain points, measure psychological safety, inform management decisions"),
      "**Anonymity Level:** " + (anonymity || "Fully anonymous, partially anonymous, attributed"),
      "**Frequency:** " + (frequency || "Quarterly pulse check, annual engagement survey"),
      "",
      "Generate ALL of the following:",
      "",
      "## 1. Survey Overview",
      "- Recommended questions count (5-7 for pulse, 20-30 for comprehensive)",
      "- Estimated completion time",
      "- Anonymity guarantee to include in intro",
      "- How results will be shared with the team",
      "",
      "## 2. Survey Questions",
      "Organized by theme, with question text + scale + follow-up prompts:",
      "",
      "### Theme: Manager & Leadership",
      "Q1: [question] — Scale: Strongly disagree (1) to Strongly agree (5)",
      "Q2: [follow-up] — Scale: ...",
      "",
      "### Theme: Psychological Safety",
      "Q3: [question]",
      "Q4: [question]",
      "",
      "### Theme: Work-Life Balance & Burnout",
      "Q5: [question]",
      "Q6: [question]",
      "",
      "### Theme: Career Growth & Development",
      "Q7: [question]",
      "Q8: [question]",
      "",
      "### Theme: Team Collaboration",
      "Q9: [question]",
      "Q10: [question]",
      "",
      "### Theme: Compensation & Recognition",
      "Q11: [question]",
      "Q12: [question]",
      "",
      "## 3. Open-Ended Questions",
      "3-4 open-ended questions to capture qualitative feedback:",
      "- Best thing about working here?",
      "- One thing you'd change?",
      "- What do you wish your manager knew?",
      "- What would make this a great place to work?",
      "",
      "## 4. Scoring Guide",
      "How to interpret scores:",
      "- What each score range means (1-2, 2-3, 3-4, 4-5)",
      "- Red flags to watch for in specific themes",
      "- Benchmark comparison framework (industry benchmarks if available)",
      "",
      "## 5. Action Planning Template",
      "After survey results:",
      "- How to share results with the team (transparently)",
      "- Team retrospective format to discuss results",
      "- Action planning template: top 3 issues → root cause → action → owner → deadline",
      "",
      "## 6. Follow-Up Survey Questions",
      "Questions to include in the NEXT survey to measure progress on action items.",
    ].join("\n");

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "system", content: "You are an expert organizational psychologist and people operations leader." }, { role: "user", content: userContent }],
      max_tokens: 1400, temperature: 0.7,
    });
    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err) {
    return NextResponse.json({ error: "Survey generation failed." }, { status: 500 });
  }
}
