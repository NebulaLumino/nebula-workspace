import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { eventName, eventType, attendees, companyBackground, keyMessages, competitors, logistics, goals } = await req.json();
    if (!eventName?.trim()) {
      return NextResponse.json({ error: "Event name is required." }, { status: 400 });
    }

    const userContent = [
      "Generate a comprehensive event briefing document for:",
      "",
      "**Event Name:** " + (eventName || "TechSummit 2026"),
      "**Event Type:** " + (eventType || "Conference, trade show, webinar, sales meeting, press event, executive dinner"),
      "**Attendees:** " + (attendees || "Target audience, estimated headcount, seniority level"),
      "**Company Background:** " + (companyBackground || "Brief company overview, recent news, key stats"),
      "**Key Messages:** " + (keyMessages || "Top 3-5 messages to communicate at the event"),
      "**Competitors:** " + (competitors || "Who else will be there or presenting"),
      "**Logistics:** " + (logistics || "Date, venue, format, booth/speaking slot details"),
      "**Goals:** " + (goals || "What success looks like — leads, PR, relationships, pipeline"),
      "",
      "Generate ALL of the following:",
      "",
      "## 1. Event Overview",
      "- Event summary: what it is, why it matters, why we are attending",
      "- Strategic rationale for attending/speaking/sponsoring",
      "- Expected outcomes and success metrics",
      "",
      "## 2. Attendee Intelligence Brief",
      "- Who will be there (role, company type, seniority, interests)",
      "- What they care about (their top 3 priorities)",
      "- What they already know about us (perception gap)",
      "- How to start a conversation that resonates",
      "",
      "## 3. Key Messages & Talking Points",
      "For each of the top 3-5 key messages:",
      "- The message (one punchy sentence)",
      "- Proof point or data to support it",
      "- Story or example that brings it to life",
      "- What NOT to say (message禁忌)",
      "",
      "## 4. Competitive Positioning",
      "- Who we are competing against for mindshare at this event",
      "- How to differentiate vs. each competitor in 1-2 sentences",
      "- Competitive battle cards: what to say when competitor X comes up",
      "",
      "## 5. Session Brief (if speaking)",
      "- Session title and description",
      "- Speaker brief: key points to cover, time allocation",
      "- Anticipated Q&A: top 5 likely questions + recommended answers",
      "- Hand-off: what to say at end to drive next step",
      "",
      "## 6. Booth / Meeting Playbook",
      "- How to work the booth effectively (for trade shows)",
      "- Qualifying questions to ask visitors",
      "- Demo talking points and flow",
      "- Lead capture priorities and qualification criteria",
      "",
      "## 7. Social & PR Strategy",
      "- Pre-event social posts (Twitter, LinkedIn — 3 variants)",
      "- Event hashtags and how to engage",
      "- Post-event content plan (blog, LinkedIn, press release)",
      "- Media and press engagement strategy",
      "",
      "## 8. Pre-Event Checklist",
      "- Materials to bring (brochures, demos, business cards, giveaways)",
      "- Team assignments (who covers what, shift schedule)",
      "- Briefing meeting schedule (pre-event alignment)",
      "- Technical requirements (AV, connectivity, demo setup)",
      "",
      "## 9. Post-Event Action Plan",
      "- Follow-up timeline (24h, 48h, 1 week)",
      "- Lead nurture sequence for event-sourced leads",
      "- Internal debrief meeting agenda",
      "- Metrics to measure event ROI",
      "",
      "Make it specific, actionable, and tied to measurable outcomes.",
    ].join("\n");

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are an expert event marketing and executive briefing specialist." },
        { role: "user", content: userContent },
      ],
      max_tokens: 1400,
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Event briefing generation failed." }, { status: 500 });
  }
}
