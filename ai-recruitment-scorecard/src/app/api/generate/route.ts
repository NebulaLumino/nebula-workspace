import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { role, seniority, department, company, keyRequirements, interviewRounds } = await req.json();
    if (!role?.trim()) {
      return NextResponse.json({ error: "Role is required." }, { status: 400 });
    }

    const userContent = [
      "Generate a comprehensive recruitment scorecard for:",
      "",
      "**Role:** " + (role || "Senior Product Manager"),
      "**Seniority:** " + (seniority || "Senior / Manager / Director / VP / IC / Principal"),
      "**Department:** " + (department || "Product / Engineering / Sales / Marketing / Operations"),
      "**Company:** " + (company || "NovaTask Inc."),
      "**Key Requirements:** " + (keyRequirements || "Technical background, 5+ years PM experience, B2B SaaS experience"),
      "**Interview Rounds:** " + (interviewRounds || "5 rounds: Recruiter, Hiring Manager, Technical, Team, Executive"),
      "",
      "Generate ALL of the following:",
      "",
      "## 1. Role Overview",
      "- Position summary (2-3 sentences)",
      "- Why this role matters to the company",
      "- Where this role sits in the organization",
      "",
      "## 2. Scorecard Summary",
      "A table of all competencies assessed and their weight:",
      "| Competency | Weight (%) | Assessment Method | Threshold for Hire |",
      "|---|---|---|---|",
      "| e.g. Technical Depth | 25% | System Design Interview | Can discuss trade-offs |",
      "",
      "## 3. Core Competencies & Interview Questions",
      "For each competency provide:",
      "- Definition: what \"good\" looks like at this seniority level",
      "- Interview questions (3-5 per competency)",
      "- What to listen for in answers (positive and negative signals)",
      "- Rating scale: 1 (Does not meet) / 2 (Meets minimum) / 3 (Meets bar) / 4 (Exceeds bar)",
      "",
      "### Competency 1: [Name]",
      "### Competency 2: [Name]",
      "(Continue for all 4-6 core competencies)",
      "",
      "## 4. Technical / Role-Specific Assessment",
      "- Specific technical skills to assess for this role",
      "- Technical exercise or case study description",
      "- Evaluation rubric for technical assessment",
      "",
      "## 5. Culture Add Assessment",
      "- What \"culture add\" means for this company/team",
      "- Specific questions to assess culture contribution",
      "- Red flags (values misalignment)",
      "- Green flags (unique perspectives they bring)",
      "",
      "## 6. Reference Check Questions",
      "5-7 specific questions to ask references, mapped to the core competencies:",
      "",
      "## 7. Interview Schedule Guide",
      "Recommended interview structure and timing:",
      "- Round 1 (Recruiter screen): What to assess",
      "- Round 2 (Hiring Manager): What to assess",
      "- Round 3 (Technical/Case): What to assess",
      "- Round 4 (Team Interview): Who to include, what to assess",
      "- Round 5 (Executive): What to assess",
      "",
      "## 8. Offer Decision Matrix",
      "Framework for making the hiring decision:",
      "- Minimum requirements (must-haves)",
      "- Differentiating factors (nice-to-haves)",
      "- How to handle a candidate who meets some but not all criteria",
      "",
      "## 9. Calibration Guide",
      "How to run an effective calibration session:",
      "- What data to prepare",
      "- How to score consistently across interviewers",
      "- How to resolve disagreements",
      "",
      "Make the scorecard specific to the role and seniority level. Include realistic, behavioral interview questions.",
    ].join("\n");

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are an expert talent acquisition leader and hiring strategist." },
        { role: "user", content: userContent },
      ],
      max_tokens: 1400,
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Scorecard generation failed." }, { status: 500 });
  }
}
