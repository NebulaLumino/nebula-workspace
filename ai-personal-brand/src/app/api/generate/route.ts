import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { name, currentRole, industry, targetAudience, careerGoals, platforms } = await req.json();
    if (!name?.trim()) {
      return NextResponse.json({ error: "Your name is required." }, { status: 400 });
    }

    const userContent = [
      "Create a complete personal brand statement and brand package for:",
      "",
      "**Name:** " + (name || "Alex Rivera"),
      "**Current Role:** " + (currentRole || "Senior Product Manager at a B2B SaaS company"),
      "**Industry:** " + (industry || "Technology / SaaS"),
      "**Target Audience:** " + (targetAudience || "Recruiters, peers, industry leaders, potential collaborators"),
      "**Career Goals:** " + (careerGoals || "Thought leadership, leadership role, speaking engagements, advisory positions"),
      "**Active Platforms:** " + (platforms || "LinkedIn, Twitter/X"),
      "",
      "Generate ALL of the following:",
      "",
      "## 1. Personal Brand Statement (3 variants)",
      "One powerful sentence (under 50 words) that captures who you are, what you do, and who you serve.",
      "- Variant A: Professional / resume-friendly",
      "- Variant B: Storytelling / conversational",
      "- Variant C: Bold / provocative",
      "",
      "## 2. Elevator Pitch (30 seconds)",
      "A 2-3 sentence conversational introduction for networking: who you are, what problem you solve, and why it matters.",
      "",
      "## 3. LinkedIn Headline Options (5 variants)",
      "Character-limited (220 chars) headlines optimized for LinkedIn search and scroll-stopping:",
      "- Keyword-led",
      "- Results-led",
      "- Curiosity-driven",
      "- Leadership brand",
      "- Industry expert angle",
      "",
      "## 4. About Section (LinkedIn / Bio)",
      "150-word \"About\" section for LinkedIn that:",
      "- Opens with a hook (problem or insight)",
      "- Shows your unique expertise and approach",
      "- Includes 2-3 specific accomplishments",
      "- Closes with what you're looking for or what excites you",
      "",
      "## 5. Twitter/X Bio",
      "160-char bio optimized for discoverability with relevant keywords and personality.",
      "",
      "## 6. Professional Tagline",
      "A consistent one-liner you use across all platforms (under 10 words).",
      "",
      "## 7. Content Pillars",
      "The 3-4 topics you consistently create content about that reinforce your brand:",
      "- Pillar name + why it matters + example post ideas",
      "",
      "## 8. Thought Leadership Angle",
      "What original perspective or contrarian view do you bring to your industry?",
      "- Your unique insight (1 sentence)",
      "- Why it's differentiated",
      "- How to communicate it consistently",
      "",
      "## 9. Brand Voice Guide",
      "How your personal brand sounds across platforms:",
      "- Tone descriptors (e.g., direct, empathetic, data-driven)",
      "- Words to use frequently",
      "- Words to avoid",
      "- Example post that sounds like you",
      "",
      "## 10. Visibility Strategy",
      "Top 3 actions to build personal brand over the next 90 days:",
      "- Specific, actionable steps with platforms and frequency",
      "",
      "Make it authentic, specific, and memorable. Avoid generic corporate language.",
    ].join("\n");

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are an expert personal brand strategist and career positioning coach." },
        { role: "user", content: userContent },
      ],
      max_tokens: 1400,
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Brand generation failed." }, { status: 500 });
  }
}
