import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { clientName, industry, companySize, productService, results, challenge, goal } = await req.json();
    if (!clientName?.trim() || !productService?.trim()) {
      return NextResponse.json({ error: "Client name and product/service are required." }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are an expert content marketer and case study writer specializing in B2B storytelling and ROI-driven narratives." },
        {
          role: "user",
          content: `Generate a complete B2B case study for:

**Client Company:** ${clientName}
**Industry:** ${industry || "Technology / SaaS"}
**Company Size:** ${companySize || "Mid-market, 50-500 employees"}
**Product/Service Used:** ${productService}
**Key Results Achieved:** ${results || "Quantifiable outcomes — time saved, revenue increased, costs reduced, efficiency gains"}
**The Challenge:** ${challenge || "What problem were they trying to solve?"}
**The Goal:** ${goal || "What did they hope to achieve?"}

Generate ALL of the following:

## 1. Case Study Overview

### Headline (3 variants)
- Results-led headline (e.g., "[Company] Reduced Churn by 40% in 90 Days")
- Transformation-led headline (e.g., "How [Company] Went from Chaos to Clarity")
- Quote-led headline (e.g., "[Quote from client]")

### Subheadline
One sentence that sets up the story and the result.

### Executive Summary (3 paragraphs)
- The challenge (what was broken, costly, or slow)
- The solution (what ${productService} did)
- The result (specific numbers, quantified)

## 2. The Client Profile

### Company Snapshot
- Industry and HQ location
- Company size (employees, revenue if public)
- Their core product/market
- Why they came to ${productService}

## 3. The Challenge

Describe the problem in detail:
- What was broken, slow, or costing them money
- What they tried before that didn't work
- The cost of the problem (revenue lost, time wasted, customers churning)
- Why existing solutions failed

## 4. The Solution

How ${productService} solved it:
- Implementation overview (how long, what was involved)
- Key features used that solved the problem
- Any customization or integration work
- Timeline from start to results

## 5. The Results (Full Detail)

Quantifiable outcomes organized by category:

### Efficiency & Productivity
Specific metrics: hours saved, tasks automated, headcount avoided

### Revenue Impact
Specific metrics: revenue increase, pipeline growth, conversion improvement

### Cost Reduction
Specific metrics: costs eliminated, savings achieved

### Customer/Employee Impact
Specific metrics: NPS improvement, satisfaction scores, retention rates

### Time to Value
How quickly did they see results?

## 6. Customer Quote(s)

Generate 2 compelling customer quotes:
- Quote 1: About the problem and why they chose ${productService}
- Quote 2: About the results and ROI
Include suggested attribution: Name, Title, Company

## 7. Key Takeaways

3-4 bullet points summarizing the most important lessons:
- What made this case study successful
- What other companies in similar situations can learn
- The ROI framework used

## 8. Call to Action

End with a soft CTA:
- How to learn more about ${productService}
- Link to relevant resources
- How to get a demo

## 9. Short Version (Social Media / Email)

A 100-word version suitable for:
- LinkedIn post (from customer's perspective)
- Email newsletter blurb
- Ad copy variant

## 10. Publishing Recommendations

- Best channels to publish this case study
- How to promote it (LinkedIn, email, paid ads)
- A/B test subject lines for email promotion
- Landing page copy to pair with it

Write the case study in a compelling narrative style. Use real-sounding names, titles, and metrics. Make it feel like a real B2B success story, not a template.`,
        },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Case study generation failed." }, { status: 500 });
  }
}
