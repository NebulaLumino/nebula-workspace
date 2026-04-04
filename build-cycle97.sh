#!/bin/bash
# Build cycle 97 apps: 2901-2910

DEEPSEEK_KEY="sk-a8e8c2a7f0b142c89ad6e89b7e6a1c3d"
OPENAI_KEY="sk-dummy-placeholder"

declare -A APPS
APPS["2901"]="ai-startup-funding-roadmap|violet|Funding Roadmap|industry, current_stage, monthly_revenue, target_raise, runway_months, investor_tier, use_of_funds|Funding Stage Roadmap, Milestone Checklist, Investor Target List, Pitch Timeline, Cap Table Notes"
APPS["2902"]="ai-pitch-deck-slides|blue|Pitch Deck Slides|company_name, industry, problem, solution, business_model, traction, team_size, ask_amount, valuation, use_of_funds|Problem Slide, Solution Slide, Market Size, Business Model, Traction Metrics, Team Slide, Financial Projections, Ask Slide"
APPS["2903"]="ai-business-model-canvas|green|Business Model Canvas|value_proposition, customer_segments, channels, customer_relationships, revenue_streams, key_resources, key_activities, key_partnerships, cost_structure|Canvas Sections, Value Proposition Map, Revenue Model, Cost Structure Analysis, Competitive Advantages, Customer Journey"
APPS["2904"]="ai-competitive-landscape|amber|Competitive Landscape|industry, your_company, competitors_5, comparison_dimensions, market_positioning, pricing_strategy|Competitive Matrix, Positioning Map, SWOT Analysis, Battle Cards, Differentiation Strategy, Win/Loss Scenarios"
APPS["2905"]="ai-startup-kpi-dashboard|rose|KPI Dashboard|business_stage, revenue_model, team_size, industry, primary_goals, investor_reporting|North Star Metric, KPI Hierarchy, Weekly/Monthly Dashboards, OKR Mapping, Investor Update Template, Benchmark Targets"
APPS["2906"]="ai-freemium-funnel|teal|Freemium Funnel|product_type, user_base_size, free_tier_features, paid_tier_price, current_conversion_rate, trial_length, onboarding_flow|Funnel Stages, Conversion Benchmarks, Drop-off Analysis, Upgrade Triggers, Paywall Strategy, Revenue Projection, A/B Test Hypotheses"
APPS["2907"]="ai-due-diligence-checklist|cyan|Due Diligence Checklist|deal_stage, investment_amount, industry, team_composition, investor_type, deal_urgency|DD Checklist Sections, Document Requests, Legal Review Items, Financial Audit Points, Team Assessment Criteria, Risk Flags"
APPS["2908"]="ai-equity-split-calculator|orange|Equity Split Calculator|num_cofounders, founder_roles, capital_contributions, time_commitment, vesting_preference, ip_contributions|Equity Split Recommendation, Vesting Schedule, Cliff Period, Acceleration Clauses, Dilution Projections at Each Round"
APPS["2909"]="ai-burn-rate-runway|burn-rate-runway|Furn Rate & Runway|monthly_revenue, monthly_expenses, team_size, funding_stage, target_runway_months, revenue_growth|Monthly Burn Rate, Runway Months, Break-even Analysis, Expense Optimization, Scenario Planning, Hiring Plan"
APPS["2910"]="ai-investor-update|pink|Investor Update|company_stage, investor_type, update_frequency, last_month_metrics, upcoming_milestones, fundraising_status, team_changes|Investor Update Structure, Metrics to Highlight, Milestone Progress, Challenges, Asks, Sentiment Framing"

install_app() {
  local app_dir="$1"
  local color="$2"
  local name="$3"
  local fields="$4"
  local outputs="$5"
  
  echo "===== Building $app_dir ====="
  
  # Write .env.local
  cat > "$app_dir/.env.local" << EOF
DEEPSEEK_API_KEY=$DEEPSEEK_KEY
OPENAI_API_KEY=$OPENAI_KEY
EOF
  
  # Write globals.css - dark theme with colored accent
  cat > "$app_dir/app/globals.css" << 'CSSEOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --accent: #8B5CF6;
}

html {
  color-scheme: dark;
}

body {
  background-color: #0f0f0f;
  color: #e5e5e5;
}
CSSEOF

  # Replace with accent color
  case "$color" in
    violet) echo 'html { color-scheme: dark; }' ;;
    blue) echo 'html { color-scheme: dark; }' ;;
    green) echo 'html { color-scheme: dark; }' ;;
    amber) echo 'html { color-scheme: dark; }' ;;
    rose) echo 'html { color-scheme: dark; }' ;;
    teal) echo 'html { color-scheme: dark; }' ;;
    cyan) echo 'html { color-scheme: dark; }' ;;
    orange) echo 'html { color-scheme: dark; }' ;;
    pink) echo 'html { color-scheme: dark; }' ;;
    burn-rate-runway) echo 'html { color-scheme: dark; }' ;;
  esac

  # Write page.tsx
  cat > "$app_dir/app/page.tsx" << 'PAGEEOF'
"use client";

import { useState } from "react";

const FIELDS = __FIELDS__;
const OUTPUTS = __OUTPUTS__;
const COLOR = "__COLOR__";

const accentColors: Record<string, string> = {
  violet: "violet",
  blue: "blue",
  green: "emerald",
  amber: "amber",
  rose: "rose",
  teal: "teal",
  cyan: "cyan",
  orange: "orange",
  pink: "pink",
  "burn-rate-runway": "orange",
};

const accent = accentColors[COLOR] || "violet";
const accentClass = `text-${accent}-400`;
const accentBg = `bg-${accent}-500`;
const accentBorder = `border-${accent}-500`;

export default function HomePage() {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOutput("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setOutput(data.result || "No output generated.");
    } catch {
      setOutput("Error generating output.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-3xl font-bold ${accentClass} mb-2`}>__NAME__</h1>
        <p className="text-gray-400 mb-8">Fill in the form to generate your startup content.</p>
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          {FIELDS.split(", ").map((f: string) => {
            const [id, label] = f.includes("_") ? [f, f.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())] : [f, f];
            return (
              <div key={id}>
                <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
                <input
                  type="text"
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:border-violet-500"
                  value={formData[id] || ""}
                  onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
                  required
                />
              </div>
            );
          })}
          <button
            type="submit"
            disabled={loading}
            className={`${accentBg} text-white px-6 py-3 rounded font-semibold hover:opacity-90 transition disabled:opacity-50`}
          >
            {loading ? "Generating..." : "Generate Output"}
          </button>
        </form>
        {output && (
          <div className="bg-gray-900 border border-gray-700 rounded p-6 whitespace-pre-wrap text-sm">
            {output}
          </div>
        )}
      </div>
    </div>
  );
}
PAGEEOF

  # Write API route
  mkdir -p "$app_dir/app/api/generate"
  cat > "$app_dir/app/api/generate/route.ts" << 'APIEOF'
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const deepseekKey = process.env.DEEPSEEK_API_KEY;

  const fieldsStr = Object.entries(body)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  const prompt = `You are a startup AI assistant. Generate detailed, professional content based on the following inputs. Format the output in clear markdown with headers and bullet points.\n\nInputs:\n${fieldsStr}\n\nGenerate the following sections: __OUTPUTS__\n\nBe specific, data-driven, and actionable in your recommendations.`;

  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${deepseekKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || "No output generated.";
    return NextResponse.json({ result: content });
  } catch (err) {
    return NextResponse.json({ error: "Failed to call DeepSeek API" }, { status: 500 });
  }
}
APIEOF

  echo "  Implemented $app_dir"
}

# Process all 10 apps
for key in 2901 2902 2903 2904 2905 2906 2907 2908 2909 2910; do
  IFS='|' read -r app_dir color name fields outputs <<< "${APPS[$key]}"
  install_app "$app_dir" "$color" "$name" "$fields" "$outputs"
done