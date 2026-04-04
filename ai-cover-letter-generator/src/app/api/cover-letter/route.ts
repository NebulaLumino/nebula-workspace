import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { name, jobTitle, company, resumeHighlights, jobDescription, tone } = await req.json();

    if (!name || !jobTitle || !company) {
      return NextResponse.json(
        { error: "Please provide your name, the job title, and company." },
        { status: 400 }
      );
    }

    const toneInstruction =
      tone === "formal"
        ? "Use a formal, professional tone throughout. Avoid contractions and colloquialisms."
        : tone === "friendly"
        ? "Use a warm, approachable professional tone — confident but personable."
        : "Use a confident, enthusiastic tone. Show genuine excitement for the role.";

    const prompt = `You are a professional career coach and resume writer. Write a compelling, personalized cover letter.

**Applicant Name:** ${name}
**Job Title:** ${jobTitle}
**Company:** ${company}
**Tone:** ${toneInstruction}

**Applicant's Key Highlights:**
${resumeHighlights || "No specific highlights provided — focus on transferable skills and enthusiasm."}

**Job Description:**
${jobDescription || "No job description provided — write a general cover letter highlighting relevant experience."}

Write a cover letter that:
- Opens with a strong hook specific to ${company} and the ${jobTitle} role
- Connects the applicant's background directly to the job requirements
- Shows genuine enthusiasm for ${company} specifically
- Uses concrete examples of achievements (not just duties)
- Closes with a clear call to action
- Is appropriate length: 250-400 words
- Does NOT repeat the resume — it should complement it

Format as clean text. No headers or labels. Return ONLY the cover letter.`;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are a senior career coach who has helped thousands of people land jobs at top companies. Your cover letters are specific, compelling, and get results.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1200,
    });

    const letter = completion.choices[0]?.message?.content;

    if (!letter) {
      return NextResponse.json({ error: "Failed to generate cover letter." }, { status: 500 });
    }

    return NextResponse.json({ letter });
  } catch (error: unknown) {
    console.error("Cover letter generation error:", error);
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
