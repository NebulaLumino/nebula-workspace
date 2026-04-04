import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { genre, premise, characters, setting, tone, twist } = await req.json();

    if (!genre) {
      return NextResponse.json({ error: "Please select a genre." }, { status: 400 });
    }

    const prompt = `You are an expert creative writer and story architect. Generate compelling story plot ideas based on:

GENRE: ${genre}
PREMISE / CORE IDEA: ${premise || "Not specified — be creative"}
MAIN CHARACTERS: ${characters || "Not specified — create compelling characters"}
SETTING: ${setting || "Not specified — choose a vivid setting"}
TONE: ${tone || "Genre-typical"}
INCLUDE TWIST: ${twist ? "Yes — add a compelling twist" : "Optional"}

Generate a rich, detailed story plot:

## 📖 Plot Concept
A compelling 2-3 paragraph overview of the story arc — opening, rising action, climax, and resolution.

## 👤 Character Arcs
For each main character: who they are at the start vs. who they become by the end. Show their transformation.

## 🔥 Key Plot Beats
The major story beats in order:
1. Opening hook — how the story begins
2. Inciting incident — the event that sets everything in motion
3. First turning point — stakes raised
4. Midpoint reversal — everything changes
5. Crisis — the darkest moment
6. Climax — the final confrontation
7. Resolution — how it all lands

## 🌆 Setting Details
Vivid descriptions of the key locations where the story unfolds.

${twist ? "## 🌀 The Twist\nA surprising but inevitable twist that reframes the story." : ""}

## ✍️ Writing Prompts
3 "what if" questions that could branch into alternative plots.

Be vivid, specific, and actionable. Write as a creative brief a novelist or screenwriter could use.`;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1100,
      temperature: 0.85,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: "Failed to generate plot." }, { status: 500 });
  }
}
