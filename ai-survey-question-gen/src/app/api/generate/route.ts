import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { surveyType, targetAudience, goals, questionCount, format } = await req.json();
    if (!surveyType?.trim()) {
      return NextResponse.json({ error: "Survey type is required." }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert UX researcher and survey designer specializing in customer feedback, market research, and product analytics.`,
        },
        {
          role: "user",
          content: `Generate a comprehensive survey question bank for:

**Survey Type:** ${surveyType}
**Target Audience:** ${targetAudience || "General consumers / B2B customers"}
**Primary Goals:** ${goals || "Understand satisfaction, identify pain points, measure NPS"}
**Number of Questions:** ${questionCount || "15-25 core questions"}
**Output Format Preference:** ${format || "Mixed (multiple choice + open-ended + rating scale)"}

Generate ALL of the following:

## 1. Survey Overview
- **Recommended survey length** (how many questions to include — shorter = higher completion rate)
- **Estimated completion time**
- **Recommended survey platform** (Typeform, Google Forms, Hotjar, etc.)
- **Optimal question ordering** (easy → sensitive → demographic)

## 2. Opening / Screening Questions (2-3)
Warm-up questions to engage respondents and filter for the right audience.
For each question: question text, question type, answer options (if applicable), and why it works.

## 3. Core Questions by Category

Organize questions into relevant categories for the survey type. Categories might include:
- Satisfaction / NPS
- Product/Service Usage
- Pain Points / Frustrations
- Feature Requests
- Likelihood to Recommend
- Price Sensitivity
- Demographics / Firmographics

For each question provide:
- **Question text** (clear, unbiased, no leading language)
- **Question type** (multiple choice, scale 1-5, scale 1-10, open-ended, ranking, yes/no)
- **Answer options** (if applicable)
- **Scoring guidance** (how to interpret / score the response)
- **Why this question matters** (what insight it unlocks)

## 4. Net Promoter Score (NPS) Question
Include the standard NPS question plus 2-3 follow-up open-ended questions to understand the score.

## 5. Open-Ended / Verbatim Questions (2-3)
- **Best question to capture qualitative insights**
- **Worst thing to eliminate** (what NOT to ask)
- **One big thing we could improve**

## 6. Demographic / Profiling Questions (2-3)
Appropriate for the target audience (company size, role, industry, usage frequency, etc.)

## 7. Survey Flow Diagram
Describe the recommended flow/order of questions with rationale.

## 8. Survey Optimization Tips
- How to increase completion rate
- How to reduce survey fatigue
- Best time to send
- Mobile vs desktop considerations
- Incentives (if appropriate)
- How to analyze the results

## 9. Question Bank Table
Provide a numbered table of all questions with:
| # | Question | Type | Category | Must-Have? |
|---|----------|------|----------|------------|

## 10. Alternative Survey Formats
If ${surveyType} isn't the best format, suggest 1-2 alternative approaches (e.g., phone interviews, focus groups, passive analytics).

Be specific. Questions should be tailored to ${surveyType || "general customer feedback"}. Avoid double-barreled questions. Make sure scales are balanced.`,
        },
      ],
      max_tokens: 1400,
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Survey generation failed." }, { status: 500 });
  }
}
