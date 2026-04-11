#!/bin/bash
set -e
WORKDIR="/Users/nebulalumino/.openclaw/workspace"

write_files() {
  local app=$1
  local hsl=$2
  local title=$3
  local desc=$4
  local system_prompt=$5
  
  mkdir -p "$WORKDIR/$app/src/app/api/generate"
  
  cat > "$WORKDIR/$app/src/app/page.tsx" << PAGEEOF
"use client";
import { useState } from "react";
export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true); setOutput("");
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: input }) });
      const data = await res.json();
      setOutput(data.result || "No output received.");
    } catch { setOutput("Error generating response."); }
    finally { setLoading(false); }
  };
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold" style="color: hsl($hsl)">$title</h1>
          <p className="text-gray-400">$desc</p>
        </div>
        <div className="bg-gray-800/60 border rounded-2xl p-6 space-y-4 shadow-xl" style="border-color: hsla($hsl, 0.3)">
          <label className="block text-sm font-medium text-gray-300">Enter your details</label>
          <textarea className="w-full h-40 bg-gray-900/80 border border-gray-700 rounded-xl p-4 text-white text-sm placeholder-gray-500 focus:outline-none resize-none"
            placeholder="Describe your financial situation, goals, and specific parameters..."
            value={input} onChange={(e) => setInput(e.target.value)} />
          <button onClick={handleGenerate} disabled={loading || !input.trim()}
            className="w-full text-white font-semibold py-3 rounded-xl transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            style="background-color: hsl($hsl)">
            {loading ? "Generating..." : "Generate Analysis"}
          </button>
        </div>
        {output && (
          <div className="bg-gray-800/60 border rounded-2xl p-6" style="border-color: hsla($hsl, 0.3)">
            <h2 className="text-lg font-semibold mb-3" style="color: hsl($hsl)">Results</h2>
            <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-wrap">{output}</div>
          </div>
        )}
      </div>
    </main>
  );
}
PAGEEOF

  cat > "$WORKDIR/$app/src/app/api/generate/route.ts" << ROUTEEOF
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
function getClient() { const apiKey = process.env.OPENAI_API_KEY; if (!apiKey) throw new Error("Missing OPENAI_API_KEY"); return new OpenAI({ apiKey, baseURL: "https://api.deepseek.com/v1" }); }
export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const completion = await getClient().chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "system", content: "$system_prompt" }, { role: "user", content: prompt }],
      temperature: 0.7, max_tokens: 2000,
    });
    return NextResponse.json({ result: completion.choices[0].message.content });
  } catch (err: any) { return NextResponse.json({ error: err.message }, { status: 500 }); }
}
ROUTEEOF
  echo "  Written files for $app"
}

repair() {
  local app=$1
  local hsl=$2
  local title=$3
  local desc=$4
  local system_prompt=$5
  
  echo "=== Repairing: $app ==="
  
  # Write correct files
  write_files "$app" "$hsl" "$title" "$desc" "$system_prompt"
  
  # Install openai if needed
  cd "$WORKDIR/$app"
  if ! grep -q '"openai"' package.json 2>/dev/null; then
    echo "  Installing openai..."
    npm install openai 2>&1 | tail -2
  fi
  
  # Build
  echo "  Building..."
  npm run build 2>&1 | grep -E "(✓|Error|error|success)" | head -5
  
  # Git commit (amend previous)
  cd "$WORKDIR/$app"
  git add -A && git commit --amend -m "feat: initial commit" --no-edit 2>&1 | tail -2
  
  # Push
  echo "  Pushing..."
  gh repo create NebulaLumino/"$app" --public --source=. --push 2>&1 | tail -3 || \
    git push -u origin main 2>&1 | tail -3
  
  # Cleanup
  rm -rf "$WORKDIR/$app/node_modules" "$WORKDIR/$app/.next"
  echo "=== DONE: $app ==="
  echo ""
}

# Fix 5 empty repos
repair "ai-options-greeks" "220,60%,55%" "Options Greeks" "Options Greeks visualizer" "You are an expert options trader and educator. Calculate and explain the options Greeks for any given option contract: 1) Delta (price sensitivity), 2) Gamma (rate of delta change), 3) Theta (time decay), 4) Vega (volatility sensitivity), 5) Rho (interest rate sensitivity). Provide interpretation of each Greek, what it means for the position, and how to use them to manage risk."

repair "ai-etf-screener" "165,55%,45%" "ETF Screener" "ETF screener and comparator" "You are an ETF specialist and fund analyst. Screen and compare ETFs: 1) Filter by expense ratio, AUM, liquidity, 2) Performance comparison across timeframes, 3) Tax efficiency analysis, 4) Tracking error assessment, 5) Sector/factor exposure comparison. Include specific ETF recommendations with ticker symbols, pros/cons, and suitability notes."

repair "ai-real-estate-roi" "45,70%,55%" "Real Estate ROI" "Real estate ROI calculator" "You are an expert real estate investment analyst. Calculate ROI for real estate investments: 1) Cap rate, cash-on-cash return, and IRR calculations, 2) Rental income analysis (gross/net), 3) Mortgage amortization breakdown, 4) Appreciation projections, 5) Operating expense analysis. Provide specific numbers, break-even analysis, and buy/hold/sell recommendations."

repair "ai-factor-investing" "255,55%,55%" "Factor Investing" "Factor investing portfolio builder" "You are an expert in factor-based investing. Design a factor investing portfolio: 1) Factor analysis (value, size, momentum, quality, profitability), 2) ETF/fund recommendations for each factor, 3) Factor exposure and diversification, 4) Historical factor premium data, 5) Risk-adjusted return expectations. Include specific fund tickers and allocation percentages."

repair "ai-black-scholes" "185,60%,55%" "Black-Scholes" "Black-Scholes option pricer" "You are an expert quantitative analyst. Use the Black-Scholes model to price options: 1) Call and put option prices, 2) Implied volatility calculations, 3) Greeks derivation from the model, 4) Sensitivity analysis (what-if scenarios), 5) Limitations and real-world adjustments. Include formulas, step-by-step calculations, and interpretation of results."

# Fix 3 old-content repos
repair "ai-emergency-fund" "175,55%,45%" "Emergency Fund" "Emergency fund planner" "You are a personal finance advisor specializing in emergency planning. Help users build and maintain emergency funds: 1) Target fund size based on expenses and risk factors, 2) Monthly savings roadmap to reach goal, 3) Best account types for emergency funds (HYSA vs money market), 4) Trigger conditions for using the fund, 5) Replenishment strategy after use. Include specific savings targets and timeline."

repair "ai-charitable-giving" "340,55%,55%" "Charitable Giving" "Charitable giving optimizer (DAF vs QCD)" "You are a philanthropic giving strategist. Optimize charitable giving: 1) DAF (Donor Advised Fund) vs QCD (Qualified Charitable Distribution) comparison, 2) Tax deduction optimization, 3) Asset donation strategy (appreciated securities vs cash), 4) Giving circles and impact assessment, 5) Multi-year giving plan. Include dollar-specific recommendations and tax savings calculations."

repair "ai-estate-planning" "215,45%,55%" "Estate Planning" "Estate planning checklist generator" "You are an estate planning attorney and financial advisor. Generate a comprehensive estate planning checklist: 1) Will and testament review, 2) Beneficiary designations audit, 3) Power of attorney setup, 4) Healthcare directives, 5) Trust strategies (revocable vs irrevocable), 6) Estate tax minimization, 7) Digital asset planning. Include state-specific considerations and priority ordering."

echo "ALL REPAIRS DONE!"
