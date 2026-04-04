import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { productName, targetIndustry, companySize, personasNeeded, goals } = await req.json();
    if (!productName?.trim()) {
      return NextResponse.json({ error: "Product/service name is required." }, { status: 400 });
    }

    const userContent = [
      "Generate comprehensive B2B buyer personas for:",
      "",
      "**Product/Service:** " + (productName || "My Product"),
      "**Target Industry:** " + (targetIndustry || "Technology / SaaS"),
      "**Company Size:** " + (companySize || "SMBs, mid-market, or enterprise"),
      "**Number of Personas:** " + (personasNeeded || "3 personas — champion, economic buyer, end user"),
      "**Primary Goals:** " + (goals || "Lead generation, content marketing, sales enablement"),
      "",
      "Generate ALL of the following for each persona:",
      "",
      "## Persona 1: [Name — The Champion / End User]",
      "### Demographics & Background",
      "- Full name, role title, age range, education",
      "- Industry and company size they work in",
      "- Years in role, career trajectory",
      "- How they spend their typical workday",
      "",
      "### Goals & Motivations",
      "- Primary professional goal (what success looks like)",
      "- Secondary goals and motivators",
      "- What keeps them up at night (top 3 pain points)",
      "- What they are trying to achieve personally (promotion, recognition, making an impact)",
      "",
      "### Challenges & Frustrations",
      "- Day-to-day frustrations with current tools/process",
      "- What they tried before that failed",
      "- Why they can't solve this on their own",
      "- Who/what frustrates them (IT, vendors, leadership)",
      "",
      "### Information Behavior",
      "- Where they get industry news and trends",
      "- Preferred content formats (blogs, podcasts, reports, social)",
      "- Key influencers they follow or trust",
      "- How much time they spend researching buying decisions",
      "",
      "### Objections & Red Flags",
      "- Top 3 objections they'll raise during sales",
      "- Questions they'll ask to test your credibility",
      "- Deal-killers (what causes them to walk away)",
      "",
      "### Buying Triggers",
      "- Events or situations that cause them to look for a solution",
      "- How they first discover solutions",
      "- Who else is involved in the decision",
      "- How long the average buying cycle looks for them",
      "",
      "### Messaging That Works",
      "- 1-line value proposition for this persona",
      "- Tagline or elevator pitch that resonates",
      "- Proof points and social proof they respond to",
      "",
      "## Persona 2: [Name — The Economic Buyer]",
      "Same 7 sections as above, from the CFO/VP Finance/executive perspective.",
      "",
      "## Persona 3: [Name — The IT/Technical Decision-Maker]",
      "Same 7 sections as above, from the IT Director/CTO/Engineering perspective.",
      "",
      "## Cross-Persona Insights",
      "- Where all 3 personas agree (shared priorities)",
      "- Where they conflict (sales challenges)",
      "- The single most important insight about this buying committee",
      "",
      "## Content Strategy by Persona",
      "For each persona: best content type, key messages, and channels to reach them.",
      "",
      "## Sales Playbook Notes",
      "- How to sequence outreach across personas",
      "- Who to involve at each stage (champion → economic buyer → IT sign-off)",
      "- How to handle competing priorities between personas",
      "",
      "Make personas feel like real people with specific, believable details. Include made-up but realistic names, companies, and quotes.",
    ].join("\n");

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are an expert B2B marketing strategist and buyer persona specialist." },
        { role: "user", content: userContent },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Persona generation failed." }, { status: 500 });
  }
}
