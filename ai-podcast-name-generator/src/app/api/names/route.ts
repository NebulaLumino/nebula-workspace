import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { niche, vibe, audience, format, keywords } = await req.json();

    if (!niche) {
      return NextResponse.json(
        { error: "Please select a podcast niche." },
        { status: 400 }
      );
    }

    const vibeMap: Record<string, string> = {
      professional: "Professional, credible, and authoritative",
      funny: "Hilarious, witty, and laugh-out-loud funny",
      deep: "Deep, thoughtful, and introspective",
      energetic: "High-energy, fast-paced, and exciting",
      calm: "Calm, relaxing, and soothing",
      bold: "Bold, provocative, and controversial",
      wholesome: "Heartwarming, positive, and inspiring",
      dark: "Dark, mysterious, and atmospheric",
      inspiring: "Motivational and uplifting",
    };

    const audienceMap: Record<string, string> = {
      general: "General audience, all ages",
      "young-adults": "Young adults aged 18-34",
      professionals: "Working professionals aged 25-50",
      entrepreneurs: "Entrepreneurs and business founders",
      creatives: "Artists, designers, and creative professionals",
      "tech-savvy": "Tech enthusiasts and early adopters",
      parents: "Parents and families",
      students: "Students and lifelong learners",
    };

    const formatMap: Record<string, string> = {
      interview: "Interview-based with guest speakers",
      solo: "Solo commentary and personal storytelling",
      storytelling: "Narrative storytelling with dramatic arcs",
      panel: "Multi-host panel discussions and debates",
      documentary: "Documentary-style deep investigative reporting",
      educational: "Educational, how-to, and explainer content",
    };

    const vibeDesc = vibe ? vibeMap[vibe] || vibe : "Engaging and memorable";
    const audienceDesc = audience ? audienceMap[audience] || audience : "General audience";
    const formatDesc = format ? formatMap[format] || format : "Variety of formats";

    const prompt = `You are an expert podcast naming consultant. Generate creative, catchy, and memorable podcast names.

**Podcast Niche:** ${niche}
**Vibe/Style:** ${vibeDesc}
**Target Audience:** ${audienceDesc}
**Show Format:** ${formatDesc}
**Keywords/Themes:** ${keywords || "No specific keywords provided"}

Generate 8 unique, catchy podcast names. For each name, provide:
1. The podcast name (make it memorable, brandable, and easy to say)
2. A suggested tagline (short, punchy, 1 sentence)
3. Brief explanation of why this name works (1-2 sentences)

Be creative — use wordplay, alliteration, rhymes, metaphors, and modern naming conventions. Avoid generic names. The name should reflect the niche, vibe, and format.

Format as a numbered list. Return ONLY the names, no preamble.`;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are a world-class podcast naming consultant with expertise in audio branding, content strategy, and audience engagement. You create memorable, distinctive podcast names that attract the right audience.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.9,
      max_tokens: 1500,
    });

    const names = completion.choices[0]?.message?.content;

    if (!names) {
      return NextResponse.json({ error: "Failed to generate names." }, { status: 500 });
    }

    return NextResponse.json({ names });
  } catch (error: unknown) {
    console.error("Podcast name generation error:", error);
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
