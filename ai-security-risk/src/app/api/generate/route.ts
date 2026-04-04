import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
const client = new OpenAI({ baseURL: "https://api.deepseek.com/v1", apiKey: process.env.DEEPSEEK_API_KEY || "" });

export async function POST(req: NextRequest) {
  try {
    const { company, industry, techStack, employees, dataTypes, regulations } = await req.json();
    if (!company?.trim()) return NextResponse.json({ error: "Company name is required." }, { status: 400 });

    const userContent = [
      "Generate a comprehensive security risk assessment:",
      "**Company:** " + (company||"NovaTask Inc."),
      "**Industry:** " + (industry||"SaaS / Technology"),
      "**Tech Stack:** " + (techStack||"AWS, React, Node.js, PostgreSQL, Stripe"),
      "**Employees:** " + (employees||"50 employees, 20 remote"),
      "**Data Handled:** " + (dataTypes||"Customer PII, payment data, API logs"),
      "**Regulations:** " + (regulations||"SOC 2, GDPR"),
      "",
      "Generate: ## 1. Risk Register (top 10 risks with Likelihood 1-5, Impact 1-5, Risk Score, Mitigation) ## 2. Threat Model ## 3. Security Controls Gap Analysis ## 4. Incident Response Plan ## 5. Compliance Roadmap ## 6. Security Budget Recommendations"
    ].join("\n");

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "system", content: "You are an expert CISO and security risk analyst." }, { role: "user", content: userContent }],
      max_tokens: 1400, temperature: 0.7,
    });
    return NextResponse.json({ result: completion.choices[0]?.message?.content || "" });
  } catch { return NextResponse.json({ error: "Risk assessment generation failed." }, { status: 500 }); }
}
