import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const { project, interviewee } = await req.json();

    if (!project?.trim()) {
      return NextResponse.json({ error: "Please describe the oral history project." }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured." }, { status: 500 });
    }

    const client = new OpenAI({ apiKey, baseURL: "https://api.deepseek.com/v1" });

    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert oral historian specializing in interview methodology, questionnaire design, and qualitative research methodology. Generate structured, ethically sound, and culturally sensitive oral history questionnaires that follow best practices from the Oral History Association and similar professional bodies. Format responses with ## section headers, numbered questions, and structured sections.`,
        },
        {
          role: "user",
          content: `Generate a comprehensive oral history questionnaire for the following project and interviewee.\n\nProject Description: ${project || "(not specified)"}\nInterviewee Background: ${interviewee || "(general — tailor questions to a representative interviewee)"}\n\nPlease provide:\n1. **Interview Overview** — The purpose, scope, and main themes of this oral history interview.\n2. **Pre-Interview Questions** — Background questions to establish context, identity, and the interviewee&apos;s connection to the project&apos;s themes.\n3. **Opening Questions** — Gentle, rapport-building questions to help the interviewee feel comfortable before deeper topics.\n4. **Thematic Question Sections** — Organized groups of questions covering key themes relevant to the project (e.g., family, work, community, major life events, cultural practices).\n5. **Sensitive Topics Protocol** — How to approach potentially difficult topics (trauma, loss, conflict, discrimination) with appropriate sensitivity and ethical care.\n6. **Closing Questions** — Questions that allow reflection, provide closure, and give the interviewee opportunity to add anything missed.\n7. **Follow-Up Questions** — Prompts to deepen responses, clarify details, and explore unexpected directions.\n8. **Interviewer Notes & Best Practices** — Guidance on prompting without leading, active listening, recording setup, and ethical considerations (informed consent, right to withdraw, archive arrangements).\n\nFormat with ## section headers and numbered questions. Include alternative phrasings for potentially sensitive topics.`,
        },
      ],
    });

    const output = response.choices[0]?.message?.content || "No response generated.";
    return NextResponse.json({ output });
  } catch (err: unknown) {
    console.error("Generate error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
