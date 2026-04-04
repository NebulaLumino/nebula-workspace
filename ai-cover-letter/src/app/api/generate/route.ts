import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { name, jobTitle, company, jobDescription, resume } = await req.json();

    if (!jobTitle || !company) {
      return NextResponse.json({ error: "Job title and company are required." }, { status: 400 });
    }

    const prompt = `You are a professional career coach and cover letter writer. Write a compelling, personalized cover letter based on the following information:

PERSONAL INFO: ${name || "[Your Name]"}
JOB TITLE: ${jobTitle}
COMPANY: ${company}
JOB DESCRIPTION: ${jobDescription || "Not provided"}
RESUME HIGHLIGHTS: ${resume || "Not provided"}

Write a professional cover letter that:
1. Opens with a strong hook specific to the company
2. Highlights 2-3 relevant qualifications from the resume that match the job
3. Shows genuine enthusiasm for the role and company
4. Closes with a clear call to action

Format it as a proper business letter. Keep it to 250-400 words. No placeholders — write as if you're the applicant.

COVER LETTER:`;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 800,
      temperature: 0.7,
    });

    const letter = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ letter });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: "Failed to generate cover letter." }, { status: 500 });
  }
}
