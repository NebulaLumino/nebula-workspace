#!/bin/bash
# Agent 1: Apps 1571-1575
cd /Users/nebulalumino/.openclaw/workspace

APPS=(
  "1571:ai-album-cover:Album Cover Generator:HSL(0, 70%, 55%):user enters band name/album title/mood/genre, AI generates album cover concepts with color palette, typography, and visual direction"
  "1572:ai-music-video-concept:Music Video Concept Generator:HSL(30, 70%, 55%):user enters song lyrics or description, AI generates music video concepts, visual metaphors, storyboard descriptions, and shot lists"
  "1573:ai-band-press-kit:Band Press Kit & Bio Writer:HSL(60, 70%, 55%):user enters band details/history/genres, AI generates a professional press kit with bio, key facts, stage plot summary, and press quotes"
  "1574:ai-tour-itinerary:Tour Itinerary Planner & Routing Optimizer:HSL(90, 70%, 50%):user enters cities/venues/dates, AI generates a day-by-day tour schedule with travel routes, accommodation notes, and rider logistics"
  "1575:ai-song-lyrics:Song Lyrics Generator:HSL(120, 70%, 45%):user enters genre, mood, theme, and optional first line, AI generates original song lyrics with verse/chorus/bridge structure"
)

for app in "${APPS[@]}"; do
  IFS=':' read -r num dir title hsl desc <<< "$app"
  echo "=== Building $num: $dir ==="

  # Scaffold
  npx create-next-app@latest "$dir" --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --yes

  # Write page.tsx
  cat > "$dir/app/page.tsx" << 'PAGEOF'
"use client";
import { useState } from "react";

const ACCENT = "hsl(__HSL__)";
const ACCENT_HOVER = "hsl(__HSL_HOVER__)";

interface FormData {
  [key: string]: string;
}

export default function Home() {
  const [inputs, setInputs] = useState<FormData>({});
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (key: string, value: string) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOutput("");
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setOutput(data.output);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3" style={{ color: ACCENT }}>
            __TITLE__
          </h1>
          <p className="text-gray-400 text-lg">AI-powered creative assistant</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mb-10">
          __FORM_FIELDS__
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: ACCENT }}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </form>

        {error && (
          <div className="p-4 mb-6 rounded-lg bg-red-900/40 border border-red-700 text-red-300">
            {error}
          </div>
        )}

        {output && (
          <div className="p-6 rounded-xl bg-gray-800/60 border border-gray-700">
            <h2 className="text-lg font-semibold mb-4" style={{ color: ACCENT }}>Generated Content</h2>
            <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap">
              {output}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
PAGEOF

  # Write API route
  cat > "$dir/app/api/generate/route.ts" << 'APIFEOF'
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const SYSTEM_PROMPT = "__SYSTEM_PROMPT__";

export async function POST(req: NextRequest) {
  try {
    const { inputs } = await req.json();
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://api.deepseek.com/v1",
    });

    const userMessage = Object.entries(inputs)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.8,
    });

    const output = completion.choices[0]?.message?.content || "No output generated.";
    return NextResponse.json({ output });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
APIFEOF

  # Build
  cd "$dir"
  npm run build 2>&1 | tail -5
  cd ..

  # Clean
  rm -rf "$dir/node_modules" "$dir/.next"

  # Git
  cd "$dir"
  git init
  git add -A
  git commit -m "Initial commit"
  gh repo create "$dir" --public --push 2>&1 | tail -3
  git branch -M main
  cd ..

  echo "=== Done: $dir ==="
done

echo "=== AGENT 1 COMPLETE ==="
