import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { topic, keyMessage, engagement, style, hashtagCount } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Please provide a topic." }, { status: 400 });
    }

    const styleInstruction =
      style === "educational"
        ? "Write in an educational, value-delivery style — share insights, frameworks, or lessons learned."
        : style === "inspirational"
        ? "Write in an inspirational, storytelling style — paint a picture, build emotion, end with a memorable takeaway."
        : style === "professional"
        ? "Write in a professional, authoritative style — demonstrate expertise, be direct, back up points."
        : "Write in a conversational, relatable style — speak to peers as equals, share genuine perspectives.";

    const engagementInstruction =
      engagement === "thought"
        ? "End with a thoughtful question to spark comments and discussion."
        : engagement === "connection"
        ? "End with a call-to-action inviting connection or conversation."
        : "End with a clear, actionable next step for the reader.";

    const prompt = `You are a LinkedIn thought leader and content strategist. Write a compelling LinkedIn post.

**Topic:** ${topic}
**Key Message:** ${keyMessage || "Share a meaningful insight or lesson"}
**Style:** ${styleInstruction}
**Call-to-Action:** ${engagementInstruction}
**Hashtag Count:** ${hashtagCount || 5} relevant hashtags

Guidelines:
- Hook the reader in the first line (the "scroll stopper")
- Use 1-2 short paragraphs max — LinkedIn favors scannable content
- Include 1-2 line breaks between paragraphs
- 1300-3000 characters ideal for reach
- End strong with the CTA
- Add ${hashtagCount || 5} relevant hashtags at the bottom

Format as a plain post — no headers, no labels, just the content.`;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are a LinkedIn Top Voice and content strategist. You write posts that get engagement, build authority, and spark genuine conversations.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 1000,
    });

    const post = completion.choices[0]?.message?.content;

    if (!post) {
      return NextResponse.json({ error: "Failed to generate post." }, { status: 500 });
    }

    return NextResponse.json({ post });
  } catch (error: unknown) {
    console.error("Post generation error:", error);
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
