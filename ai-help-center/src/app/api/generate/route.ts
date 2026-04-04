import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { productName, productType, userTypes, supportVolume, topics, existingCategories } = await req.json();
    if (!productName?.trim()) {
      return NextResponse.json({ error: "Product name is required." }, { status: 400 });
    }

    const userContent = [
      "Generate a complete help center taxonomy and category structure for:",
      "",
      "**Product:** " + (productName || "My SaaS Product"),
      "**Product Type:** " + (productType || "B2B SaaS / productivity tool / CRM / project management"),
      "**User Types:** " + (userTypes || "Admins, regular users, API developers, billing managers"),
      "**Monthly Support Volume:** " + (supportVolume || "Low (<50 tickets), Medium (50-200), High (200+)"),
      "**Common Support Topics:** " + (topics || "Getting started, integrations, billing, feature questions, troubleshooting"),
      "**Existing Categories (if any):** " + (existingCategories || "None or describe what exists"),
      "",
      "Generate ALL of the following:",
      "",
      "## 1. Help Center Architecture Overview",
      "The top-level structure (3-4 primary buckets) and why this organization works for your user types.",
      "",
      "## 2. Full Category Tree",
      "For each top-level category, provide:",
      "- Category name",
      "- Category description (1-2 sentences)",
      "- Icon/emoji recommendation",
      "- Subcategories (3-5 per category)",
      "- Why users would look here",
      "",
      "## 3. Article Templates per Category",
      "For each category, provide a template for the types of articles it should contain:",
      "- Getting Started Guide template",
      "- Troubleshooting / How-to template",
      "- Reference article template",
      "- FAQ template",
      "- Video tutorial description",
      "",
      "## 4. Cross-Cutting Articles",
      "Articles that span multiple categories and should be:",
      "- Featured prominently across the help center",
      "- Updated regularly",
      "",
      "## 5. Self-Service Resolution Strategy",
      "- Which categories should have the highest article coverage (based on support volume)",
      "- Which categories need video walkthroughs vs text articles",
      "- When to use interactive wizards vs static articles",
      "- How to link related articles within each category",
      "",
      "## 6. Search Optimization",
      "- Top keywords users will search for mapped to the right category",
      "- How to name and structure articles for SEO",
      "- Internal linking strategy between categories",
      "",
      "## 7. Maintenance & Governance",
      "- Who owns each category (team responsible)",
      "- How often articles should be reviewed and updated",
      "- How to handle articles for new features",
      "- Archiving outdated content process",
      "",
      "## 8. Implementation Roadmap",
      "- Phase 1: Must-have categories (MVP help center)",
      "- Phase 2: Expand with secondary categories",
      "- Phase 3: Advanced content (videos, interactive guides)",
      "",
      "Make the taxonomy logical, user-centered, and easy to navigate. Consider how different user types (admin vs end user vs developer) need different entry points.",
    ].join("\n");

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are an expert customer support strategist and information architect." },
        { role: "user", content: userContent },
      ],
      max_tokens: 1400,
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Help center generation failed." }, { status: 500 });
  }
}
