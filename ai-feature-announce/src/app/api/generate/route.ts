import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { productName, featureName, featureDescription, audience, emailType, goal } = await req.json();
    if (!productName?.trim() || !featureName?.trim()) {
      return NextResponse.json({ error: "Product name and feature name are required." }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are an expert product marketing copywriter specializing in feature announcements and product launch communications." },
        {
          role: "user",
          content: `Generate a complete feature announcement email package for:

**Product Name:** ${productName}
**New Feature Name:** ${featureName}
**Feature Description:** ${featureDescription || "What the feature does and why it matters"}
**Target Audience:** ${audience || "Existing customers who would benefit from this feature"}
**Email Type:** ${emailType || "New feature announcement"}
**Goal of Email:** ${goal || "Drive feature adoption, re-engage users, generate excitement"}

Generate ALL of the following:

## 1. Email Variants (3 Versions)

### Version A: Benefit-Led Announcement
- **Subject lines** (5 options)
- **Preview text**
- **Email body** — lead with the benefit/outcome, not the feature
- **CTA**

### Version B: Curiosity-Gap Announcement
- **Subject lines** (5 options)
- **Preview text**
- **Email body** — tease the problem, reveal the solution
- **CTA**

### Version C: Story/Product-Led Announcement
- **Subject lines** (5 options)
- **Preview text**
- **Email body** — narrative of why this feature was built
- **CTA**

## 2. Email Copy by Section

### Subject Line Bank (15 total, across 3 versions)
Each with: subject line, why it works, best used for

### Opening Lines (3 variants)
First 1-2 sentences — what grabs attention

### Feature Description Block
How to describe the feature clearly and compellingly

### Benefit Bridge
How to connect the feature to a specific user benefit/outcome

### Social Proof / Validation
How to include metrics, user quotes, or usage data

### CTA Section
Primary CTA + secondary/dismiss CTA
CTA button copy options

## 3. Email for Different Segments

### For Power Users (already using the product actively)
- Tone: Exciting, insider
- Angle: "You asked, we built..."

### For Lapsed/Inactive Users
- Tone: Welcoming back, low-pressure
- Angle: "We made some changes you should see..."

### For New Users (signed up in last 30 days)
- Tone: Educational, onboarding-integrated
- Angle: "Here's a feature that will help you get started..."

## 4. Multi-Channel Adaptations

### In-App Notification Copy
Short version of the announcement for in-app banners/tooltips.

### Push Notification Copy
If applicable — ultra-short, max 50 chars.

### Social Media Announcement
Twitter/X (280 chars), LinkedIn, Facebook versions.

### Changelog / Release Notes Entry
For product changelog or release notes page.

## 5. A/B Testing Recommendations

- Which subject line variant to test first
- What to test (send time, CTA copy, send frequency)
- Key metrics to track (open rate, click rate, CTA conversion)

Be specific with copy. Every email should feel like it was written for a real product launch, not a template.`,
        },
      ],
      max_tokens: 1400,
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Feature announcement generation failed." }, { status: 500 });
  }
}
