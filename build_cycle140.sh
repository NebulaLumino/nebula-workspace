#!/bin/bash
set -e

WORKSPACE="/Users/nebulalumino/.openclaw/workspace"
DEEPSEEK_KEY="${OPENAI_API_KEY:-sk-48987c1a1dc246ecb1b52a01647e8b16}"
GITHUB_TOKEN="${GITHUB_TOKEN:-$(gh auth token 2>/dev/null)}"

echo "=== Building Cycle 140 Apps ==="
echo "DeepSeek key: ${DEEPSEEK_KEY:0:8}..."
echo "GitHub token: ${GITHUB_TOKEN:0:8}..."

apps=(
  "4271|ai-restaurant-cost|AI Restaurant Menu Item & Recipe Cost Calculator|orange|You are an expert restaurant cost analyst and chef. Analyze recipe costs, calculate food cost percentage, suggest menu pricing, and provide profitability insights for restaurant menu items."
  "4272|ai-hotel-review|AI Hotel Guest Review Sentiment & Complaint Analyzer|blue|You are an expert hospitality analyst. Analyze hotel guest reviews for sentiment, identify common complaints, categorize feedback by department, and provide actionable improvement recommendations."
  "4273|ai-fitness-planner|AI Gym Member Onboarding & Fitness Goal Planner|green|You are an expert fitness coach and personal trainer. Create comprehensive onboarding assessments, set SMART fitness goals, design workout plans, and track progress for gym members."
  "4274|ai-florist-guide|AI Florist Arrangement Description & Care Guide Generator|pink|You are an expert florist and horticulturist. Generate beautiful arrangement descriptions, care instructions for flowers and plants, seasonal availability notes, and gifting recommendations."
  "4275|ai-tutor-lesson|AI Tutor Lesson Plan & Worksheet Generator|purple|You are an expert educator and curriculum designer. Create detailed lesson plans aligned to grade levels, generate differentiated worksheets, quizzes, and educational activities for tutors."
  "4276|ai-mechanic-dtc|AI Mechanic Diagnostic Trouble Code (DTC) Explainer|red|You are an expert automotive mechanic. Explain diagnostic trouble codes (DTCs) in plain language, suggest probable causes, recommend diagnostic steps, and estimate repair complexity for vehicle issues."
  "4277|ai-vet-history|AI Veterinarian Patient History Summary Writer|teal|You are an expert veterinary technician. Summarize patient history from clinical notes, extract key medical events, medications, allergies, and create concise clinical summaries for veterinarians."
  "4278|ai-landscape-scope|AI Landscaper Project Scope & Plant Selection Guide|emerald|You are an expert landscape designer and horticulturist. Define project scopes, select appropriate plants for climate zones, suggest hardscaping, and create maintenance schedules for landscaping projects."
  "4279|ai-gemstone-cert|AI Jeweler Gemstone Certification Description Generator|violet|You are an expert gemologist and jewelry appraiser. Generate professional gemstone certification descriptions, explain grading characteristics, and create compelling product descriptions for jewelry."
  "4280|ai-travel-agent|AI Travel Agent Custom Itinerary & Budget Planner|cyan|You are an expert travel consultant. Create detailed custom itineraries, optimize travel budgets, suggest destinations and accommodations, and plan day-by-day activities for travelers."
)

for app_spec in "${apps[@]}"; do
  IFS='|' read -r task slug name accent system_prompt <<< "$app_spec"
  app_dir="$WORKSPACE/$slug"
  echo ""
  echo "=== [$task] $slug ==="
  
  # Create Next.js app
  if [ -d "$app_dir" ]; then
    echo "[SKIP] Already exists: $app_dir"
  else
    echo "[CREATE] Creating Next.js app..."
    npx create-next-app@latest "$slug" \
      --typescript --tailwind --app --no-src-dir \
      --import-alias "@/*" --yes \
      2>&1 | tail -5
    echo "[OK] Created"
  fi
  
  # Write globals.css
  cat > "$app_dir/app/globals.css" << CSS_EOF
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}

body {
  background: linear-gradient(135deg, #111827 0%, #030712 50%, #111827 100%);
  min-height: 100vh;
  color: #f9fafb;
}

@layer utilities {
  .bg-dark-gradient {
    background: linear-gradient(135deg, #111827 0%, #030712 50%, #111827 100%);
  }
}
CSS_EOF
  echo "[OK] Updated globals.css"
  
  # Write page.tsx
  cat > "$app_dir/app/page.tsx" << 'PAGE_EOF'
'use client';

import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setError('');
    setResult('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      setResult(data.result);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-dark-gradient px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">APP_TITLE</h1>
          <p className="text-gray-400 text-lg">Powered by AI — Enter your details below to get started</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <label htmlFor="input" className="block text-sm font-medium text-gray-300 mb-2">
              Enter your details
            </label>
            <textarea
              id="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your needs, paste data, or enter details here..."
              className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-ACCENT-500 focus:border-transparent resize-y min-h-32"
              rows={6}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-ACCENT-600 hover:bg-ACCENT-500 disabled:bg-gray-700 disabled:text-gray-400 text-white font-semibold rounded-xl transition-colors duration-200"
          >
            {loading ? 'Generating...' : 'Generate Result'}
          </button>
        </form>
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-xl text-red-300 text-sm">
            {error}
          </div>
        )}
        {result && (
          <div className="p-6 bg-gray-800/60 border border-gray-700 rounded-xl">
            <h2 className="text-lg font-semibold text-ACCENT-400 mb-3">Result</h2>
            <pre className="text-gray-300 whitespace-pre-wrap text-sm font-mono leading-relaxed">
              {result}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
PAGE_EOF
  
  # Replace placeholders
  sed -i '' "s/APP_TITLE/$name/g" "$app_dir/app/page.tsx"
  sed -i '' "s/ACCENT/$accent/g" "$app_dir/app/page.tsx"
  echo "[OK] Updated page.tsx"
  
  # Write API route
  mkdir -p "$app_dir/app/api/generate"
  cat > "$app_dir/app/api/generate/route.ts" << ROUTE_EOF
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
});

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();
    if (!input?.trim()) {
      return NextResponse.json({ error: 'Input is required' }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'SYSTEM_PROMPT\n\nProvide detailed, well-structured, professional output. Format with clear sections and headings where appropriate.'
        },
        {
          role: 'user',
          content: input
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const result = completion.choices[0]?.message?.content || 'No result generated.';
    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
ROUTE_EOF
  
  # Replace system prompt placeholder
  sed -i '' "s/SYSTEM_PROMPT/$system_prompt/g" "$app_dir/app/api/generate/route.ts"
  echo "[OK] Created /api/generate route"
  
  # Build
  echo "[BUILD] Running npm run build..."
  build_output=$(cd "$app_dir" && npm run build 2>&1)
  if echo "$build_output" | grep -q "Error\|error:"; then
    echo "[WARN] Build issues: $(echo "$build_output" | tail -10)"
  else
    echo "[OK] Build passed"
  fi
  
  # Clean up
  rm -rf "$app_dir/node_modules" "$app_dir/.next"
  echo "[OK] Cleaned node_modules and .next"
  
  # Git init, commit, create repo, push
  if [ -d "$app_dir/.git" ]; then
    echo "[SKIP] Git repo already exists"
  else
    cd "$app_dir"
    git init
    git add .
    git commit -m "feat: initial $slug app — $name"
    echo "[OK] Git committed"
    
    # Create GitHub repo and push
    gh repo create "$slug" --public --push 2>&1 || {
      git remote add origin "https://NebulaLumino:${GITHUB_TOKEN}@github.com/NebulaLumino/${slug}.git"
      git push -u origin HEAD 2>&1
    }
    echo "[OK] Pushed to GitHub"
    cd "$WORKSPACE"
  fi
  
  # Verify .git exists
  if [ -d "$app_dir/.git" ]; then
    echo "[VERIFY] ✓ .git EXISTS for $slug"
  else
    echo "[VERIFY] ✗ .git MISSING for $slug!"
  fi
  
  echo "=== DONE: [$task] $slug ==="
done

echo ""
echo "=== ALL 10 APPS BUILT ==="
