import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { eventType, date, location, guestCount, budget, preferences, vibe } = await req.json();

    if (!eventType || !date) {
      return NextResponse.json({ error: "Event type and date are required." }, { status: 400 });
    }

    const prompt = `You are an expert event planner and coordinator. Create a comprehensive event plan based on the following details:

EVENT TYPE: ${eventType}
DATE: ${date}
LOCATION: ${location || "TBD"}
GUEST COUNT: ${guestCount || "Not specified"}
BUDGET: ${budget || "Not specified"}
STYLE/VIBE: ${vibe || "General"}
PREFERENCES: ${preferences || "None specified"}

Create a detailed event plan including:

## 🎉 Event Overview
Brief summary of the event concept and theme.

## 📅 Timeline & Schedule
A detailed hour-by-hour or segment-by-segment schedule for the event day.

## 📍 Venue & Logistics
Venue recommendations, setup requirements, parking, accessibility notes.

## 🎨 Theme & Décor Ideas
Color palette, décor style, table settings, and atmosphere suggestions.

## 🍽️ Food & Beverages
Catering style recommendations, menu ideas, drink options, dietary accommodations.

## 🎵 Entertainment & Activities
Suggested activities, music, games, or special moments to include.

## ✅ Checklist
A pre-event checklist with items to arrange 1 week before, 1 day before, and day-of.

## 💰 Budget Estimate
A rough cost breakdown for key categories based on typical ${eventType} events.

Format clearly with headers, bullet points, and emoji. Be practical and detailed.`;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const plan = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ plan });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: "Failed to generate event plan." }, { status: 500 });
  }
}
