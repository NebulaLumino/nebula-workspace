import { OpenAI } from "openai";

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { company, context, length, audience, tone } = await req.json();

    if (!company) {
      return new Response(JSON.stringify({ error: "Company name is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const prompt = `You are an expert executive summary writer. Create a compelling executive summary based on the following information:

Company: ${company}
Context: ${context || "Not provided"}
Length: ${length || "Medium"}
Target Audience: ${audience || "General business audience"}
Tone: ${tone || "Professional"}

Include the following sections in your executive summary:
1. **Overview** - A brief 2-3 sentence introduction of the company/situation
2. **Key Points** - 3-5 bullet points covering the most important information
3. **Analysis** - A concise paragraph providing critical insights or recommendations
4. **Conclusion** - A strong closing statement with next steps or call to action

Format your response in clean Markdown. Use bold headers.`;

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are an expert executive summary writer. Produce clean, well-structured Markdown output.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1200,
    });

    const summary = completion.choices[0]?.message?.content || "Failed to generate summary.";

    return new Response(JSON.stringify({ summary }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
