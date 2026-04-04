#!/usr/bin/env python3
"""Build Cycle 97 apps."""

import os, subprocess

WS = "/Users/nebulalumino/.openclaw/workspace"
DEEPSEEK_KEY = "sk-a8e8c2a7f0b142c89ad6e89b7e6a1c3d"

APPS = [
    ("ai-startup-funding-roadmap", "violet", "AI Startup Funding Roadmap Generator", [
        ("industry", "Industry"),
        ("current_stage", "Current Funding Stage"),
        ("monthly_revenue", "Monthly Revenue ($)"),
        ("target_raise", "Target Raise Amount ($)"),
        ("runway_months", "Runway in Months"),
        ("investor_tier", "Target Investor Tier"),
        ("use_of_funds", "Primary Use of Funds"),
    ], "Funding Stage Roadmap | Milestone Checklist | Investor Target List | Pitch Timeline | Cap Table Notes"),

    ("ai-pitch-deck-slides", "blue", "AI Pitch Deck Slide Generator", [
        ("company_name", "Company Name"),
        ("industry", "Industry"),
        ("problem", "Problem Statement"),
        ("solution", "Solution"),
        ("business_model", "Business Model"),
        ("traction", "Current Traction"),
        ("team_size", "Team Size"),
        ("ask_amount", "Ask Amount ($)"),
        ("valuation", "Valuation ($)"),
        ("use_of_funds", "Use of Funds"),
    ], "Problem Slide | Solution Slide | Market Size | Business Model | Traction Metrics | Team Slide | Financial Projections | Ask Slide"),

    ("ai-business-model-canvas", "green", "AI Business Model Canvas Generator", [
        ("value_proposition", "Value Proposition"),
        ("customer_segments", "Customer Segments"),
        ("channels", "Channels"),
        ("customer_relationships", "Customer Relationships"),
        ("revenue_streams", "Revenue Streams"),
        ("key_resources", "Key Resources"),
        ("key_activities", "Key Activities"),
        ("key_partnerships", "Key Partnerships"),
        ("cost_structure", "Cost Structure"),
    ], "Canvas Sections | Value Proposition Map | Revenue Model | Cost Structure Analysis | Competitive Advantages | Customer Journey"),

    ("ai-competitive-landscape", "amber", "AI Competitive Landscape Matrix Generator", [
        ("industry", "Industry"),
        ("your_company", "Your Company Name"),
        ("competitors_5", "Top 5 Competitors (comma-separated)"),
        ("comparison_dimensions", "Comparison Dimensions"),
        ("market_positioning", "Market Positioning"),
        ("pricing_strategy", "Pricing Strategy"),
    ], "Competitive Matrix | Positioning Map | SWOT Analysis | Battle Cards | Differentiation Strategy | Win/Loss Scenarios"),

    ("ai-startup-kpi-dashboard", "rose", "AI Startup KPI Dashboard Generator", [
        ("business_stage", "Business Stage"),
        ("revenue_model", "Revenue Model"),
        ("team_size", "Team Size"),
        ("industry", "Industry"),
        ("primary_goals", "Primary Goals"),
        ("investor_reporting", "Investor Reporting Needs"),
    ], "North Star Metric | KPI Hierarchy | Weekly/Monthly Dashboards | OKR Mapping | Investor Update Template | Benchmark Targets"),

    ("ai-freemium-funnel", "teal", "AI Freemium Conversion Funnel Generator", [
        ("product_type", "Product Type"),
        ("user_base_size", "User Base Size"),
        ("free_tier_features", "Free Tier Features"),
        ("paid_tier_price", "Paid Tier Price ($/mo)"),
        ("current_conversion_rate", "Current Conversion Rate (%)"),
        ("trial_length", "Trial Length (days)"),
        ("onboarding_flow", "Onboarding Flow Description"),
    ], "Funnel Stages | Conversion Benchmarks | Drop-off Analysis | Upgrade Triggers | Paywall Strategy | Revenue Projection | A/B Test Hypotheses"),

    ("ai-due-diligence-checklist", "cyan", "AI Startup Due Diligence Checklist Generator", [
        ("deal_stage", "Deal Stage"),
        ("investment_amount", "Investment Amount ($)"),
        ("industry", "Industry"),
        ("team_composition", "Team Composition"),
        ("investor_type", "Investor Type"),
        ("deal_urgency", "Deal Urgency"),
    ], "DD Checklist Sections | Document Requests | Legal Review Items | Financial Audit Points | Team Assessment Criteria | Risk Flags"),

    ("ai-equity-split-calculator", "orange", "AI Co-Founder Equity Split Calculator", [
        ("num_cofounders", "Number of Co-Founders"),
        ("founder_roles", "Founder Roles"),
        ("capital_contributions", "Capital Contributions ($)"),
        ("time_commitment", "Expected Time Commitment"),
        ("vesting_preference", "Vesting Schedule Preference"),
        ("ip_contributions", "IP Contributions"),
    ], "Equity Split Recommendation | Vesting Schedule | Cliff Period | Acceleration Clauses | Dilution Projections"),

    ("ai-burn-rate-runway", "orange", "AI Startup Burn Rate & Runway Calculator", [
        ("monthly_revenue", "Monthly Revenue ($)"),
        ("monthly_expenses", "Monthly Expenses ($)"),
        ("team_size", "Team Size"),
        ("funding_stage", "Funding Stage"),
        ("target_runway_months", "Target Runway (months)"),
        ("revenue_growth", "Expected Monthly Revenue Growth (%)"),
    ], "Monthly Burn Rate | Runway Months | Break-even Analysis | Expense Optimization | Scenario Planning | Hiring Plan"),

    ("ai-investor-update", "pink", "AI Investor Update Template Generator", [
        ("company_stage", "Company Stage"),
        ("investor_type", "Investor Type"),
        ("update_frequency", "Update Frequency"),
        ("last_month_metrics", "Last Month Key Metrics"),
        ("upcoming_milestones", "Upcoming Milestones"),
        ("fundraising_status", "Fundraising Status"),
        ("team_changes", "Team Changes"),
    ], "Investor Update Structure | Metrics to Highlight | Milestone Progress | Challenges | Asks | Sentiment Framing"),
]

ACCENT = {
    "violet": "violet",
    "blue": "blue",
    "green": "emerald",
    "amber": "amber",
    "rose": "rose",
    "teal": "teal",
    "cyan": "cyan",
    "orange": "orange",
    "pink": "pink",
}

PAGE_TEMPLATE = """\
"use client";
import {useState} from "react";

export default function HomePage() {
  const [formData, setFormData] = useState<Record<string,string>>({});
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOutput("");
    try {
      const r = await fetch("/api/generate", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(formData),
      });
      const d = await r.json();
      setOutput(d.result || "No output.");
    } catch {
      setOutput("Error generating output.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200 px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-COLOR-400 mb-3">APP_NAME</h1>
          <p className="text-gray-400">Fill in the form below to generate startup content.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 mb-8">
FIELDS
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-COLOR-500 text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50`}
          >
            {loading ? "Generating..." : "Generate Output"}
          </button>
        </form>
        {output && (
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 whitespace-pre-wrap text-sm leading-relaxed text-gray-300">
            {output}
          </div>
        )}
      </div>
    </div>
  );
}
"""

FIELD_TEMPLATE = """\
          <div key="FIELD_ID">
            <label className="block text-sm font-medium text-gray-300 mb-1">FIELD_LABEL</label>
            <input
              type="text"
              className={`w-full bg-gray-900 border border-gray-700 rounded px-3 py-2.5 text-gray-200 focus:outline-none focus:border-COLOR-500 placeholder-gray-600 text-sm`}
              value={formData["FIELD_ID"] ?? ""}
              onChange={e => setFormData(p => ({...p, ["FIELD_ID"]: e.target.value}))}
              required
            />
          </div>
"""

API_TEMPLATE = """\
import {NextRequest,NextResponse} from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const key = process.env.DEEPSEEK_API_KEY;

  const fieldsStr = Object.entries(body)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\\n");

  const prompt = `You are a startup AI assistant. Generate detailed, professional markdown content based on the following inputs. Format output with clear headers and bullet points.

Inputs:
${fieldsStr}

Generate these sections: OUTPUT_STR

Be specific, data-driven, and actionable.`;

  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
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
  } catch {
    return NextResponse.json({ error: "Failed to call DeepSeek API" }, { status: 500 });
  }
}
"""

def implement_app(app_dir, color, name, fields, outputs_str):
    path = os.path.join(WS, app_dir)
    if not os.path.exists(path):
        print(f"SKIP {app_dir} - not found")
        return False

    accent = ACCENT.get(color, "violet")

    # .env.local
    with open(os.path.join(path, ".env.local"), "w") as f:
        f.write(f"DEEPSEEK_API_KEY={DEEPSEEK_KEY}\n")
        f.write("OPENAI_API_KEY=sk-dummy-placeholder\n")

    # globals.css
    with open(os.path.join(path, "app", "globals.css"), "w") as f:
        f.write("@tailwind base;\n@tailwind components;\n@tailwind utilities;\n")
        f.write("html{color-scheme:dark}body{background:#0f0f0f;color:#e5e5e5}\n")

    # Build fields HTML
    fields_html = ""
    for fn, fl in fields:
        fields_html += FIELD_TEMPLATE\
            .replace("FIELD_ID", fn)\
            .replace("FIELD_LABEL", fl)\
            .replace("COLOR", accent)

    # Build page.tsx
    page = PAGE_TEMPLATE\
        .replace("APP_NAME", name)\
        .replace("COLOR", accent)\
        .replace("FIELDS", fields_html)

    with open(os.path.join(path, "app", "page.tsx"), "w") as f:
        f.write(page)

    # API route
    api_dir = os.path.join(path, "app", "api", "generate")
    os.makedirs(api_dir, exist_ok=True)
    api = API_TEMPLATE.replace("OUTPUT_STR", outputs_str)
    with open(os.path.join(api_dir, "route.ts"), "w") as f:
        f.write(api)

    print(f"Implemented: {app_dir}")
    return True

def build_and_push(app_dir):
    path = os.path.join(WS, app_dir)
    gh = f"https://github.com/NebulaLumino/{app_dir}.git"

    print(f"  Building {app_dir}...")
    r = subprocess.run(["npm", "run", "build"], cwd=path, capture_output=True, text=True, timeout=300)
    if r.returncode != 0:
        print(f"  BUILD FAILED for {app_dir}")
        print(r.stderr[-600:])
        return False
    print(f"  Build OK: {app_dir}")

    subprocess.run(["git", "init"], cwd=path, capture_output=True)
    subprocess.run(["git", "config", "user.email", "noreply@nebulalumino.com"], cwd=path, capture_output=True)
    subprocess.run(["git", "config", "user.name", "NebulaLumino"], cwd=path, capture_output=True)
    subprocess.run(["git", "add", "."], cwd=path, capture_output=True)
    subprocess.run(["git", "commit", "-m", "Initial commit - Cycle 97"], cwd=path, capture_output=True)

    rv = subprocess.run(["git", "remote", "-v"], cwd=path, capture_output=True, text=True)
    if "origin" not in rv.stdout:
        subprocess.run(["git", "remote", "add", "origin", gh], cwd=path, capture_output=True)

    r = subprocess.run(["git", "push", "-u", "origin", "main", "--force"],
           cwd=path, capture_output=True, text=True, timeout=90)
    if r.returncode != 0:
        print(f"  PUSH FAILED for {app_dir}: {r.stderr[-200:]}")
        return False
    print(f"  Pushed: {app_dir}")

    subprocess.run(["rm", "-rf", "node_modules", ".next"], cwd=path)
    print(f"  Cleaned: {app_dir}")
    return True

def main():
    pushed = []
    failed = []

    for app_dir, color, name, fields, outputs in APPS:
        ok = implement_app(app_dir, color, name, fields, outputs)
        if not ok:
            failed.append(app_dir)

    for app_dir, color, name, fields, outputs in APPS:
        if app_dir in failed:
            continue
        ok = build_and_push(app_dir)
        (pushed if ok else failed).append(app_dir)

    print(f"\n=== CYCLE 97 COMPLETE ===")
    print(f"Pushed: {pushed}")
    if failed:
        print(f"Failed: {failed}")

    r = subprocess.run(["df", "-h", "/"], capture_output=True, text=True)
    print(r.stdout.strip())

if __name__ == "__main__":
    main()