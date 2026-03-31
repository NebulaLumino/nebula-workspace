#!/bin/bash
# Build Cycle 65 apps script
WORKSPACE=/Users/nebulalumino/.openclaw/workspace
DEEPSEEK_KEY=sk-48987c1a1dc246ecb1b52a01647e8b16

build_app() {
  local num=$1
  local slug=$2
  local accent=$3
  local form_fields=$4
  local prompt_instructions=$5

  echo "=== Building app $num: $slug ==="
  cd $WORKSPACE

  if [ -d "$slug" ]; then
    echo "Directory $slug exists, skipping create-next-app"
  else
    npx create-next-app@latest "$slug" --typescript --tailwind --eslint --app --src-dir --no-import-alias --yes 2>&1 | tail -5
  fi

  if [ ! -d "$slug/src/app" ]; then
    echo "ERROR: $slug src/app not created"
    return 1
  fi

  # Write page.tsx
  cat > "$slug/src/app/page.tsx" << 'PAGEEOF'
"use client";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setOutput("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      if (!res.ok) throw new Error("Generation failed");
      const data = await res.json();
      setOutput(data.result || data.output || JSON.stringify(data));
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8" style={{ background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)" }}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-white">AI Generator</h1>
        <p className="text-gray-400 mb-8">Fill in the details below and click Generate</p>
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
PAGEEOF

  # Add form fields dynamically
  echo "$form_fields" >> "$slug/src/app/page.tsx"

  cat >> "$slug/src/app/page.tsx" << 'PAGEEOF2'
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "hsl(var(--accent-hue), 70%, 55%)" }}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </form>
        {error && <div className="text-red-400 mb-4 p-3 bg-red-900/20 rounded-lg">{error}</div>}
        {output && (
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-white">Result</h2>
            <pre className="text-gray-300 whitespace-pre-wrap text-sm font-mono">{output}</pre>
          </div>
        )}
      </div>
    </main>
  );
}
PAGEEOF2

  # Write route.ts
  mkdir -p "$slug/src/app/api/generate"
  cat > "$slug/src/app/api/generate/route.ts" << 'ROUTEEOF'
import OpenAI from "openai";

export async function POST(req: Request) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const { input } = await req.json();

  const completion = await openai.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      {
        role: "system",
        content: `You are an expert startup and entrepreneurship AI assistant. ${prompt_instructions}`
      },
      { role: "user", content: input }
    ],
    temperature: 0.7,
  });

  return Response.json({ result: completion.choices[0].message.content });
}
ROUTEEOF

  echo "prompt for $slug: $prompt_instructions" | head -c 100
  echo "..."

  # Build
  cd "$slug"
  npm run build 2>&1 | tail -10
  local build_result=$?

  # Cleanup immediately
  rm -rf node_modules .next

  if [ $build_result -ne 0 ]; then
    echo "BUILD FAILED for $slug"
    return 1
  fi

  echo "=== $slug built and cleaned successfully ==="
  return 0
}

# App definitions: num|slug|accent-hue|form_fields|prompt_instructions
# form_fields as textarea inputs
build_app "1931" "ai-startup-pitch-deck" "0" '          <textarea
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-red-500 focus:outline-none resize-y min-h-24"
            placeholder="Company Name, Problem, Solution, Market Size, Traction, Ask (e.g. Our Company: NovaTech | Problem: Founders spend 20hrs/wk on admin | Solution: AI-powered founder assistant | Market: \$50B TAM | Traction: 500 paying users | Ask: \$1.5M seed)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />' 'Generate a compelling startup pitch deck. Include: Problem slide, Solution, Market size & opportunity, Business model, Traction & metrics, Team, The Ask (funding amount & use of funds). Format as a clear slide-by-slide narrative that a VC would love.'
