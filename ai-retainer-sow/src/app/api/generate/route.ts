import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
const client = new OpenAI({ baseURL: "https://api.deepseek.com/v1", apiKey: process.env.DEEPSEEK_API_KEY || "" });

export async function POST(req: NextRequest) {
  try {
    const { clientName, serviceType, duration, monthlyValue, deliverables, team, paymentTerms } = await req.json();
    if (!clientName?.trim()) {
      return NextResponse.json({ error: "Client name is required." }, { status: 400 });
    }

    const userContent = [
      "Generate a complete retainer Scope of Work document:",
      "",
      "**Client:** " + (clientName || "Acme Corp"),
      "**Service Type:** " + (serviceType || "Marketing agency retainer, legal services, consulting, fractional executive"),
      "**Duration:** " + (duration || "12 months, renewable"),
      "**Monthly Value:** " + (monthlyValue || "$5,000/month"),
      "**Deliverables:** " + (deliverables || "List of monthly deliverables and commitments"),
      "**Team:** " + (team || "Account lead + specialists"),
      "**Payment Terms:** " + (paymentTerms || "Net 30, invoiced monthly"),
      "",
      "Generate ALL of the following:",
      "",
      "## 1. Executive Summary",
      "1 paragraph: who the client is, what the retainer covers, and the value it delivers.",
      "",
      "## 2. Services & Deliverables",
      "For each month/service period: specific deliverables with acceptance criteria, quantity, and quality standard.",
      "",
      "## 3. Out of Scope",
      "Explicit list of what is NOT included in this retainer.",
      "",
      "## 4. Retainer Structure",
      "- Monthly hours or capacity committed",
      "- How hours are tracked and reported",
      "- What happens if hours are unused in a month",
      "- Additional hours beyond retainer: rate and approval process",
      "",
      "## 5. Timeline & Phases",
      "For each quarter or phase: milestones and deliverables expected.",
      "",
      "## 6. Reporting & Communication",
      "- Reporting cadence (weekly, bi-weekly, monthly)",
      "- Format of reports",
      "- Communication channels and response time expectations",
      "- Scheduled review meetings",
      "",
      "## 7. Payment & Invoicing",
      "- Monthly retainer amount",
      "- Payment terms (Net 30, etc.)",
      "- Late payment policy",
      "- What triggers additional fees",
      "",
      "## 8. Termination Rights",
      "- Either party termination notice period",
      "- What happens to work in progress",
      "- Final invoice obligations",
      "",
      "## 9. Change Request Process",
      "- How to request work outside the retainer scope",
      "- Approval process and timeline for change requests",
      "- Pricing for additional work",
      "",
      "## 10. Acceptance Criteria",
      "How deliverables are approved: process, timeline, and what constitutes acceptance.",
    ].join("\n");

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "system", content: "You are an expert consultant and agency principal." }, { role: "user", content: userContent }],
      max_tokens: 1400, temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err) {
    return NextResponse.json({ error: "SOW generation failed." }, { status: 500 });
  }
}
