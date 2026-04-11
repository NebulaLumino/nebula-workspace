#!/bin/bash
set -e
WORKDIR="/Users/nebulalumino/.openclaw/workspace"

write_page() {
  local app=$1
  local hsl=$2
  local title=$3
  local desc=$4
  
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
}

write_route() {
  local app=$1
  local system_prompt=$2
  mkdir -p "$WORKDIR/$app/src/app/api/generate"
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
}

build_app() {
  local idx=$1
  local app=$2
  local hsl=$3
  local title=$4
  local desc=$5
  local system_prompt=$6
  
  echo "=== [$idx] Building: $app ==="
  
  # Scaffold if needed
  if [ ! -f "$WORKDIR/$app/package.json" ]; then
    echo "  Scaffolding..."
    cd "$WORKDIR"
    npx create-next-app@latest "$app" --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack --yes 2>&1 | tail -5
  fi
  
  # Write page and route
  write_page "$app" "$hsl" "$title" "$desc"
  write_route "$app" "$system_prompt"
  
  # Install & build
  cd "$WORKDIR/$app"
  npm install openai 2>&1 | tail -2
  echo "  Building..."
  npm run build 2>&1 | grep -E "(✓|Error|error|Route|success)" | head -8
  
  # Git init/commit
  if [ ! -d "$WORKDIR/$app/.git" ]; then
    git init && git add -A && git commit -m "feat: initial commit" 2>&1 | tail -2
  fi
  
  # Push
  echo "  Pushing..."
  if gh repo view NebulaLumino/"$app" &>/dev/null; then
    git push -u origin main 2>&1 | tail -3
  else
    gh repo create NebulaLumino/"$app" --public --source=. --push 2>&1 | tail -3
  fi
  
  # Cleanup
  rm -rf "$WORKDIR/$app/node_modules" "$WORKDIR/$app/.next"
  echo "=== DONE: $app ==="
  echo ""
}

# 15 remaining apps
build_app "3506" "ai-tax-loss-harvest" "0,65%,50%" "Tax Loss Harvest" "Tax loss harvesting optimizer" "You are an expert tax optimization advisor. Analyze investment portfolios for tax loss harvesting opportunities: 1) Identify unrealized losses that can be harvested, 2) Calculate potential tax savings (short-term vs long-term), 3) Wash sale rule compliance guidance, 4) Tax lot optimization strategies, 5) Year-end tax planning recommendations. Include specific examples with dollar amounts."
build_app "3507" "ai-emergency-fund" "175,55%,45%" "Emergency Fund" "Emergency fund planner" "You are a personal finance advisor specializing in emergency planning. Help users build and maintain emergency funds: 1) Target fund size based on expenses and risk factors, 2) Monthly savings roadmap to reach goal, 3) Best account types for emergency funds (HYSA vs money market), 4) Trigger conditions for using the fund, 5) Replenishment strategy after use. Include specific savings targets and timeline."
build_app "3508" "ai-debt-payoff" "335,55%,55%" "Debt Payoff" "Debt snowball/avalanche optimizer" "You are a debt repayment strategist. Compare debt payoff strategies: 1) Snowball method (smallest balance first), 2) Avalanche method (highest interest first), 3) Hybrid approach, 4) Balance transfer analysis, 5) Total interest saved comparison. Include amortization schedules, monthly payment plans, and exact payoff dates."
build_app "3509" "ai-factor-investing" "255,55%,55%" "Factor Investing" "Factor investing portfolio builder" "You are an expert in factor-based investing. Design a factor investing portfolio: 1) Factor analysis (value, size, momentum, quality, profitability), 2) ETF/fund recommendations for each factor, 3) Factor exposure and diversification, 4) Historical factor premium data, 5) Risk-adjusted return expectations. Include specific fund tickers and allocation percentages."
build_app "3510" "ai-retirement-projection" "200,45%,45%" "Retirement Projection" "Retirement savings projection" "You are a retirement planning actuary. Create comprehensive retirement projections: 1) Current vs required retirement savings, 2) Multiple scenario analysis (conservative/moderate/aggressive), 3) Social Security optimization, 4) Required minimum distributions, 5) Healthcare cost planning. Include specific savings targets, annual contribution needs, and success probability."
build_app "3511" "ai-black-scholes" "185,60%,55%" "Black-Scholes" "Black-Scholes option pricer" "You are an expert quantitative analyst. Use the Black-Scholes model to price options: 1) Call and put option prices, 2) Implied volatility calculations, 3) Greeks derivation from the model, 4) Sensitivity analysis (what-if scenarios), 5) Limitations and real-world adjustments. Include formulas, step-by-step calculations, and interpretation of results."
build_app "3512" "ai-risk-tolerance" "25,70%,55%" "Risk Tolerance" "Risk tolerance quiz and profile builder" "You are a financial risk assessment advisor. Conduct a comprehensive risk tolerance assessment: 1) Risk capacity (financial ability to take risk), 2) Risk willingness (psychological comfort with risk), 3) Risk knowledge assessment, 4) Investor profile classification (conservative to aggressive), 5) Asset allocation recommendations matching the profile. Include a quiz format with scoring rubric."
build_app "3513" "ai-net-worth" "125,55%,45%" "Net Worth Tracker" "Net worth tracker generator" "You are a personal wealth analyst. Help track and grow net worth: 1) Asset inventory (investments, real estate, cash, crypto), 2) Liability breakdown (mortgages, loans, credit cards), 3) Net worth calculation and history, 4) Year-over-year growth analysis, 5) Wealth-building roadmap with specific milestones. Include templates and tracking methodology."
build_app "3514" "ai-behavioral-finance" "305,60%,60%" "Behavioral Finance" "Behavioral finance bias detector" "You are an expert in behavioral finance and investor psychology. Identify cognitive and emotional biases: 1) Loss aversion analysis, 2) Overconfidence bias, 3) Herd behavior detection, 4) Anchoring effects, 5) Present bias. Provide a bias score, evidence-based mitigation strategies, and a personalized action plan to improve investment decision-making."
build_app "3515" "ai-dca-strategist" "75,60%,50%" "DCA Strategist" "Dollar cost averaging strategist" "You are a DCA (Dollar Cost Averaging) investment strategist. Optimize DCA strategies: 1) Lump sum vs DCA comparison with historical data, 2) Optimal DCA frequency and amount, 3) Asset allocation for DCA portfolios, 4) Roth conversion ladder analysis, 5) Tax-efficient DCA in different account types. Include backtested results and specific fund recommendations."
build_app "3516" "ai-etf-screener" "165,55%,45%" "ETF Screener" "ETF screener and comparator" "You are an ETF specialist and fund analyst. Screen and compare ETFs: 1) Filter by expense ratio, AUM, liquidity, 2) Performance comparison across timeframes, 3) Tax efficiency analysis, 4) Tracking error assessment, 5) Sector/factor exposure comparison. Include specific ETF recommendations with ticker symbols, pros/cons, and suitability notes."
build_app "3517" "ai-charitable-giving" "340,55%,55%" "Charitable Giving" "Charitable giving optimizer (DAF vs QCD)" "You are a philanthropic giving strategist. Optimize charitable giving: 1) DAF (Donor Advised Fund) vs QCD (Qualified Charitable Distribution) comparison, 2) Tax deduction optimization, 3) Asset donation strategy (appreciated securities vs cash), 4) Giving circles and impact assessment, 5) Multi-year giving plan. Include dollar-specific recommendations and tax savings calculations."
build_app "3518" "ai-estate-planning" "215,45%,55%" "Estate Planning" "Estate planning checklist generator" "You are an estate planning attorney and financial advisor. Generate a comprehensive estate planning checklist: 1) Will and testament review, 2) Beneficiary designations audit, 3) Power of attorney setup, 4) Healthcare directives, 5) Trust strategies (revocable vs irrevocable), 6) Estate tax minimization, 7) Digital asset planning. Include state-specific considerations and priority ordering."
build_app "3519" "ai-cash-flow-forecast" "0,60%,50%" "Cash Flow Forecast" "Small business cash flow forecaster" "You are a small business CFO and financial analyst. Forecast cash flow for small businesses: 1) 13-week cash flow projection, 2) AR/AP analysis and timing, 3) Seasonal adjustment modeling, 4) Break-even analysis, 5) Working capital optimization, 6) Scenario planning (best/base/worst case). Include spreadsheet methodology and specific cash position projections."
build_app "3520" "ai-pe-ratio" "235,55%,55%" "P/E Analyzer" "P/E ratio and valuation analyzer" "You are a stock valuation expert and financial analyst. Analyze P/E ratios and valuations: 1) Trailing vs forward P/E comparison, 2) PEG ratio calculation and interpretation, 3) Industry-relative valuation, 4) Historical P/E percentile analysis, 5) Growth-adjusted fair value estimation. Include specific company analysis examples with buy/sell/hold signals based on valuation."

echo "ALL APPS BUILT!"
