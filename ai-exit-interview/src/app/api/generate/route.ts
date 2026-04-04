import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { companySize, industry, rolesToAnalyze, departureReason, retentionRate, exitInterviewGoal } = await req.json();
    if (!companySize?.trim()) {
      return NextResponse.json({ error: "Company size is required." }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert HR strategist and people analytics specialist specializing in employee retention, turnover analysis, and HR process improvement.`,
        },
        {
          role: "user",
          content: `Generate a comprehensive exit interview analysis report and retention strategy for:

**Company Size:** ${companySize}
**Industry:** ${industry || "Technology / SaaS"}
**Roles to Analyze:** ${rolesToAnalyze || "Engineering, Sales, Customer Success, Marketing, Operations"}
**Primary Departure Reasons:** ${departureReason || "Career growth, compensation, management, work-life balance, remote work"}
**Current Retention Rate:** ${retentionRate || "70-80% (annual)"}
**Exit Interview Goal:** ${exitInterviewGoal || "Understand why people leave and build actionable retention strategies"}

Generate ALL of the following:

## 1. Exit Interview Analysis Framework

### How to Conduct Exit Interviews
- Who should conduct the exit interview (HR, manager, or neutral party)
- When to conduct (timing — same day vs last week)
- How to ask without leading
- What to do with the data
- How to create psychological safety for honest answers

### Exit Interview vs Stay Interview
- Difference between exit interviews and proactive "stay interviews"
- When to use each
- How to run effective stay interviews to prevent departures

## 2. Departure Reason Taxonomy

Classify the top departure reasons with specifics:

### Career Growth (Most Common)
- Why it happens
- Warning signs months before departure
- How to catch it early
- Root cause analysis questions

### Compensation & Benefits
- Market rate misalignment
- Hidden compensation (equity, bonuses, perks)
- How to audit and fix

### Management & Leadership
- Direct manager issues
- Leadership culture problems
- Signs of toxic management
- How to intervene

### Work-Life Balance & Flexibility
- Remote/hybrid vs in-office tensions
- Burnout signals
- Flexibility as a retention lever

### Lack of Purpose / Engagement
- Cultural misalignment
- Missing growth opportunities
- Feeling invisible or underutilized

### Commute / Location
- Geographic factors
- Office location as hidden turnover driver

## 3. Exit Interview Question Bank

### Required Questions (Legal & Standard)
Questions you must ask for compliance and benchmarking:
- 8-10 questions with exact wording and why each matters

### Diagnostic Questions (Root Cause)
To get to the real reason they left:
- 10-12 questions designed to uncover the true cause
- Follow-up probing techniques
- "If you could change one thing..." framing

### Feedback Questions for the Company
To get actionable improvement input:
- 8-10 questions about processes, culture, management, compensation
- What to ask vs what not to ask (legal pitfalls)

### Positive Exit Questions
To capture what worked and should be amplified:
- 5-6 questions about what they'll miss and what to keep

## 4. Exit Interview Data Analysis Guide

### How to Categorize Responses
- Create a coding framework for qualitative responses
- Aggregate into themes
- Quantitative vs qualitative data mix

### Identifying Patterns
- How to spot trends across multiple exits
- Cohort analysis (who is leaving, when, and why)
- Department/team-level analysis
- Manager-level exit patterns

### Calculating Turnover Cost
- Cost per departure by role (provide formula and benchmarks)
- Total cost of turnover impact
- ROI of retention investments

## 5. Retention Recommendations by Role Type

For each role category (${rolesToAnalyze || "Engineering, Sales, Customer Success, Marketing, Operations"}):
- Specific retention risks for that role
- Top 3 retention initiatives to implement
- Compensation, career path, and engagement levers
- Warning signs to watch for
- Early intervention playbook

## 6. Retention Strategy Action Plan

### 0-30 Days: Quick Wins
- Immediate actions to reduce immediate turnover risk
- Exit interview process improvements
- Manager training quick hits

### 30-90 Days: Structural Fixes
- Compensation audit and adjustments
- Career path documentation
- Manager effectiveness program

### 90-180 Days: Culture & Systems
- Engagement survey and action planning
- Performance management overhaul
- Culture initiatives

### Ongoing: Monitor & Iterate
- Quarterly retention review cadence
- Key metrics to track
- Stay interview program

## 7. Key Metrics to Track

| Metric | Definition | How to Measure | Target |
|--------|-----------|---------------|--------|
- Voluntary turnover rate
- Involuntary turnover rate
- Regrettable vs non-regrettable attrition
- Stay interview completion rate
- Manager effectiveness score
- Internal mobility rate
- Exit interview completion rate

## 8. Manager Accountability Framework

- How to hold managers accountable for team retention
- Metrics to include in manager performance reviews
- Training requirements for managers on retention
- When to put a manager on a performance improvement plan for retention issues

## 9. Legal & Ethical Considerations

- What NOT to ask in exit interviews (discrimination, harassment)
- Documentation requirements
- Privacy and confidentiality
- How to handle complaints disclosed in exit interviews
- When to escalate to HR/legal

## 10. Stay Interview Template

Proactive alternative to exit interviews:
- 15 questions to ask active employees
- How to run a stay interview program
- How often to conduct them
- How to act on the data

Be specific with benchmarks, dollar figures, and timelines. Use real HR terminology and legal considerations where relevant.`,
        },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Exit interview analysis generation failed." }, { status: 500 });
  }
}
