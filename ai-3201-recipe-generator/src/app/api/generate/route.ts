import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are a world-class culinary AI with expertise in recipes, meal planning, nutrition, and cooking techniques. Generate comprehensive, delicious, and practical recipes with exact measurements, clear instructions, and helpful tips. Format your response with proper markdown headers, bullet points, and sections. Include nutritional information when relevant.`,
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    return Response.json({ result: completion.choices[0].message.content });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
