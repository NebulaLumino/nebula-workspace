import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { founderName, companyName, industry, foundingStory, keyChallenge, keyLesson, audience } = await req.json();
    if (!companyName?.trim()) {
      return NextResponse.json({ error: "Company name is required." }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert brand storyteller, journalist, and content strategist specializing in founder narratives, startup stories, and authentic brand storytelling.`,
        },
        {
          role: "user",
          content: `Generate a comprehensive founder story package for:

**Founder Name:** ${founderName || "[Founder name]"}
**Company Name:** ${companyName}
**Industry:** ${industry || "Technology / SaaS"}
**Founding Story Summary:** ${foundingStory || "The core story of how and why the company was started"}
**Key Challenge Overcome:** ${keyChallenge || "The biggest obstacle or turning point"}
**Key Lesson Learned:** ${keyLesson || "The most important insight from the journey"}
**Target Audience:** ${audience || "Investors, customers, press, potential hires"}

Generate ALL of the following:

## 1. Full Founder Story (Long-Form)

A compelling 600-800 word narrative story of ${founderName}'s journey building ${companyName}. Structure:
- **Opening hook** (first 2 sentences — grab attention immediately)
- **The origin moment** (why this founder, why this problem, why this time)
- **The struggle** (early failures, doubts, setbacks — make it human)
- **The turning point** (the key moment everything changed)
- **The breakthrough** (how they solved it, what they built)
- **The meaning** (why it matters beyond the business)
- **The vision** (where they're going and why it matters)

## 2. Short Founder Bio (3 variants)

### 60-Second Version (for podcast intros, event MCs)
~120 words — punchy, memorable, covers the arc.

### 30-Second Version (LinkedIn, speaker bios)
~60 words — just the essentials with impact.

### One-Line Version (social media, email signatures)
One powerful sentence that captures the essence.

## 3. "About" Page Version

For ${companyName}'s website About page — 300-400 words:
- Warm, authentic, human voice
- Not corporate — should feel like a personal essay
- Make readers feel like they know ${founderName} after reading it
- End with a personal note and connection to the reader

## 4. Investor Pitch Story Version

For use in VC pitch meetings — 2 minutes max:
- The hook (why THIS problem, why NOW)
- The founder's unique insight or unfair advantage
- The journey (condensed)
- What they built and what it proved
- The vision (big and credible)
- The ask (implicit — invest in us)

## 5. Company "Origin Story" for Press/Media Kit

For journalists — 150-200 words:
- Journalistic style, facts-first
- Key facts embedded naturally
- Compelling narrative arc
- Quote from ${founderName} included
- Boilerplate for ${companyName} appended

## 6. Hiring / Culture Story

For career pages and recruitment:
- Why ${founderName} started ${companyName} — the human mission
- What kind of people they're looking for
- What working at ${companyName} is like
- The opportunity for someone joining now

## 7. Storytelling Framework

Explain the narrative structure used:
- The "2+2=4" principle — setup, conflict, resolution
- Why vulnerability makes stories more compelling
- How to find your unique story angle
- The emotional beats to hit

## 8. Story Angles by Audience

Tailor the story differently for each audience:
- **For investors:** What makes the founder uniquely positioned to win
- **For customers:** Why the founder cares so deeply about solving their problem
- **For press:** What makes this story newsworthy and timely
- **For hires:** What the mission means for someone joining the team
- **For partners:** Why ${companyName} is the company to bet on

## 9. Key Themes & Emotional Beats to Land

Define the emotional core:
- Primary emotion: [what the story makes people feel]
- Secondary emotion: [the deeper feeling]
- The "through line" — the single thread connecting every version
- What NOT to say (stories that would undermine the brand)

## 10. Speech / Talk Framework

If ${founderName} were to give a short talk:
- Full structure with time cues
- Opening 30 seconds (the hook)
- Body (3 key points, each 1-2 minutes)
- Close (the call to action or memorable ending)

Be vivid, specific, and emotionally resonant. Use concrete details. The founder story should make investors want to write a check, customers want to buy, hires want to join, and press want to write about ${companyName}.`,
        },
      ],
      max_tokens: 1500,
      temperature: 0.8,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Founder story generation failed." }, { status: 500 });
  }
}
