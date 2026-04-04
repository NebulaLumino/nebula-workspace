import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: "https://api.deepseek.com/v1",
});

export async function POST(req: Request) {
  const { inputs } = await req.json();
  const completion = await openai.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      {
        role: "user",
        content: `You are a professional fitness and activewear stylist. Generate a comprehensive activewear and athleisure capsule wardrobe for the following profile:

- Fitness Activities: ${inputs.activities || "Running, yoga, gym"}
- Gender: ${inputs.gender || "Unisex"}
- Body Type: ${inputs.bodyType || "Average"}
- Climate: ${inputs.climate || "Temperate"}
- Budget: ${inputs.budget || "Moderate"}
- Aesthetic: ${inputs.aesthetic || "Clean and minimal"}
- Workout Frequency: ${inputs.frequency || "3-4 times per week"}

Please provide a detailed plan including:
1. **Activity-Based Wardrobe** – specific pieces for each activity (running, strength training, yoga, HIIT, etc.)
2. **Core Essentials** – versatile pieces that work across multiple activities
3. **Color Palette & Fabric Guide** – performance fabrics, moisture-wicking materials, seasonal considerations
4. **Brand Recommendations** – quality brands across budget tiers
5. **Care & Longevity Tips** – washing, rotation, when to replace
6. **Style Transition** – how to style athleisure pieces for casual everyday wear

Format as clean markdown with headers, bullet points, and bold text. Be specific about item names, fabrics, and colors.`,
      },
    ],
  });
  return Response.json({ result: completion.choices[0].message.content });
}
