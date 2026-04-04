import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { topic, targetAudience, whitepaperType, goal, length, companyName } = await req.json();
    if (!topic?.trim()) {
      return NextResponse.json({ error: "Topic is required." }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert whitepaper writer and content strategist specializing in B2B thought leadership, research reports, and authority-building content.`,
        },
        {
          role: "user",
          content: `Generate a comprehensive whitepaper outline for:

**Topic:** ${topic}
**Target Audience:** ${targetAudience || "B2B executives, practitioners, decision-makers"}
**Whitepaper Type:** ${whitepaperType || "Research findings, how-to guide, industry analysis, problem-solution, comparative analysis"}
**Goal of Whitepaper:** ${goal || "Lead generation, thought leadership, brand authority, sales enablement"}
**Desired Length:** ${length || "3,000-5,000 words"}
**Company / Brand (optional):** ${companyName || "Your company name for context"}

Generate ALL of the following:

## 1. Whitepaper Positioning Statement

Before the outline — establish the whitepaper's positioning:
- **Core thesis:** The single most important argument this whitepaper makes
- **Why it matters now:** Why this topic is urgent/timely
- **What readers will learn:** 3-5 specific takeaways
- **What readers will do after reading:** The action or decision this leads to
- **Competitive positioning:** How this whitepaper differentiates from existing content on this topic

## 2. Executive Summary Outline

Draft the executive summary structure:
- **Hook** (1-2 sentences): Why this matters right now
- **The problem** (2-3 sentences): What readers are struggling with
- **The insight** (2-3 sentences): Your key finding or breakthrough
- **The implications** (2-3 sentences): What this means for readers
- **The solution / recommendation** (2-3 sentences): What readers should do
- **Call to action** (1 sentence): What to do next

## 3. Full Whitepaper Outline

Provide a detailed chapter-by-chapter outline with:

### Chapter 1: Introduction / The Problem
- What to cover
- Key arguments to make
- Statistics/data to include
- How many words (~300-400)
- Emotional hook to use

### Chapter 2: The Research / Evidence
- Data sources to reference
- Key findings to present
- How to visualize data (charts, frameworks)
- How many words (~600-800)

### Chapter 3: The Analysis / Deep Dive
- Framework or model to introduce
- Key insights to develop
- Case studies or examples
- How many words (~800-1000)

### Chapter 4: The Solution / Recommendations
- The actionable framework
- Step-by-step recommendations
- Tools or processes to suggest
- How many words (~600-800)

### Chapter 5: The Implications / What It Means
- Industry implications
- Future trends
- What decision-makers should do
- How many words (~400-500)

### Chapter 6: Conclusion + Call to Action
- Summary of key points
- Immediate next steps
- Resources to provide
- How many words (~300-400)

## 4. Supporting Content Elements

### Data Points to Research / Include
- 10-15 specific statistics, studies, or data points to source
- Where to find credible sources
- How to present data compellingly

### Visual Elements to Include
- Charts and graphs needed (with descriptions)
- Infographic concepts
- Framework diagrams
- Comparison tables

### Key Terminology to Define
- 5-8 technical or industry terms to define for the audience
- Why each matters

## 5. Source Recommendations

### Primary Sources
- Industry reports and studies to reference
- Academic sources if applicable
- Government/regulatory data
- Original research opportunities (surveys, interviews)

### Secondary Sources
- credible publications and analysts
- Thought leaders to reference or quote
- Compelling case studies to include

## 6. Title Options

Generate 10 compelling whitepaper title options:
- Each should be specific, benefit-led, and intriguing
- Include main title + subtitle format
- Evaluate each for SEO potential and shareability

## 7. Promotion & Distribution Plan

### Content repurposing
- What social posts, blog posts, and email sequences to create from this whitepaper
- How to extend into 3+ content assets

### Distribution channels
- Email list segments to target
- LinkedIn targeting strategy
- Paid promotion options
- Partner co-marketing opportunities

### Lead generation strategy
- Landing page copy outline
- Lead capture form fields
- Follow-up nurture sequence

## 8. Writing Timeline & Process

- Recommended writing timeline (weeks 1-4)
- Who should be involved (writers, editors, designers, subject matter experts)
- Key milestones and review gates

Be specific. The outline should be detailed enough that a writer could start drafting immediately. Include real examples of framing and structure.`,
        },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Whitepaper outline generation failed." }, { status: 500 });
  }
}
