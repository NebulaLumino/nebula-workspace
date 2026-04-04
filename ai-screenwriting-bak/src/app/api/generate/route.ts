import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

let _client: OpenAI | null = null;
function getClient() {
  if (!_client) {
    _client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://api.deepseek.com/v1",
    });
  }
  return _client;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const keys = ["genre","logline","setting","tone","length","archetype","title","format","budget","location","audience","platform","content_type","demographics","release_date","episodes","source_lang","target_lang","age_rating","runtime","voice_style","pages","experience","protagonist_name","antagonist","supporting","world_rules","conflict","resolution","themes","shooting_schedule","characters","timeline","props","costumes","era","terrain","climate","lighting","budget_amount","inconsistency_type","script_content","festival_type","premiere_goal","bts_content_type","distribution","dialogue_sample","reading_level","ep_num","season_count","episode_runtime","pacing_notes","critics_praise","critics_concerns","languages"];
    let prompt = `You are an expert screenwriter. Write a compelling screenplay excerpt based on: Genre: {genre}, Logline: {logline}, Setting: {setting}, Tone: {tone}, Format: {length}, Protagonist: {archetype}. Include scene heading, action lines, character names, dialogue, and parentheticals. Format as proper screenplay with FADE IN, act structure markers, and scene beats. Write approximately 8-12 pages worth of content.`;
    for (const key of keys) {
      prompt = prompt.replace(new RegExp("{" + key + "}", "g"), String(body[key] || ""));
    }
    const completion = await getClient().chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are a world-class expert in this domain. Provide detailed, actionable, well-structured output." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });
    return NextResponse.json({ result: completion.choices[0].message.content });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
