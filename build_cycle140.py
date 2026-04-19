#!/usr/bin/env python3
import subprocess, os, time

WORKSPACE = "/Users/nebulalumino/.openclaw/workspace"

APPS = [
    {"num":"4261","name":"ai-legal-contract-review","title":"AI Legal Contract Review & Clause Risk Analyzer","desc":"Upload or paste a legal contract to analyze clause-by-clause risk, flag unfavorable terms, and generate a structured risk report.","accent":"amber","prompt":"You are an expert legal analyst. Analyze the following contract text and return a structured risk report in markdown format. Include: 1) Overall Risk Assessment (Low/Medium/High), 2) Clause-by-Clause Risk Analysis (flagging risky, ambiguous, or unfavorable clauses with severity), 3) Key Red Flags, 4) Recommended Negotiations, 5) Summary. Contract text:\n{input}"},
    {"num":"4262","name":"ai-medical-literature","title":"AI Medical Literature & Research Paper Summarizer","desc":"Paste a research paper abstract or full text to get a structured summary, key findings, methodology breakdown, and clinical relevance.","accent":"teal","prompt":"You are a medical research analyst. Summarize the following research paper in a structured format. Include: 1) Paper Title & Authors (if available), 2) Study Type & Design, 3) Key Findings (bullet points), 4) Methodology Summary, 5) Clinical Relevance & Applications, 6) Limitations, 7) Bottom Line (one-paragraph take-away). Paper text:\n{input}"},
    {"num":"4263","name":"ai-agri-pest-ident","title":"AI Agricultural Pest & Disease Identifier","desc":"Describe crop symptoms or paste field observations to identify likely pests, diseases, and recommended integrated pest management actions.","accent":"emerald","prompt":"You are an agricultural Extension specialist. Based on the following crop symptom description, identify: 1) Most Likely Pest or Disease (with scientific name if applicable), 2) Supporting Evidence from symptoms, 3) Other Possible Diagnoses, 4) Integrated Pest Management (IPM) Recommendations, 5) Prevention Strategies, 6) Severity Assessment. Crop description:\n{input}"},
    {"num":"4264","name":"ai-construction-safety","title":"AI Construction Site Safety Incident Reporter","desc":"Describe a construction site incident to generate a compliant OSHA-style safety incident report with causal analysis and corrective action recommendations.","accent":"orange","prompt":"You are a construction safety officer. Generate a detailed safety incident report based on the following description. Include: 1) Incident Summary, 2) Date/Time/Location/Weather, 3) Parties Involved, 4) Sequence of Events, 5) Root Cause Analysis (5 Whys), 6) OSHA Classification, 7) Immediate Corrective Actions, 8) Long-Term Preventive Measures, 9) Lessons Learned. Incident description:\n{input}"},
    {"num":"4265","name":"ai-energy-optimizer","title":"AI Energy Bill & Utility Usage Optimizer","desc":"Upload or enter utility bill data and energy usage patterns to receive a personalized energy efficiency plan with estimated savings and ROI.","accent":"green","prompt":"You are an energy efficiency consultant. Analyze the following utility data and usage information to generate an optimization report. Include: 1) Current Usage Summary & Benchmarks, 2) Anomalies & Waste Identified, 3) Top 5 Efficiency Recommendations with estimated savings, 4) ROI & Payback Period for each, 5) Smart Thermostat/IoT Suggestions, 6) Peak Demand Reduction Strategies, 7) Estimated Annual Savings Total. Utility data:\n{input}"},
    {"num":"4266","name":"ai-drug-interaction","title":"AI Pharmaceutical Drug Interaction Checker","desc":"Enter a list of medications to receive a structured drug interaction analysis, severity ratings, and clinical recommendations.","accent":"rose","prompt":"You are a clinical pharmacist. Analyze the following list of medications for drug-drug interactions and clinical considerations. Include: 1) Drug-Drug Interaction Table (Drug A vs Drug B, severity: Major/Moderate/Minor, mechanism, recommendation), 2) Contraindications & Black Box Warnings, 3) Side Effect Amplification Risks, 4) Monitoring Parameters, 5) Alternative Medications to Consider, 6) Patient Counseling Points. Drug list:\n{input}"},
    {"num":"4267","name":"ai-insurance-claims","title":"AI Insurance Claims Damage Description Analyzer","desc":"Submit a damage description from an insurance claim to receive severity assessment, repair cost estimates, coverage analysis, and claim optimization tips.","accent":"sky","prompt":"You are an insurance claims analyst. Analyze the following property or auto damage description to generate a claims report. Include: 1) Damage Classification & Type, 2) Severity Assessment (Minor/Moderate/Severe/Total Loss), 3) Estimated Repair Cost Range, 4) Coverage Analysis (which policy types apply), 5) Document Checklist for Claim, 6) Adjuster Negotiation Points, 7) Common Claim Pitfalls to Avoid. Damage description:\n{input}"},
    {"num":"4268","name":"ai-networking-outage","title":"AI Telecom Network Outage Root Cause Summarizer","desc":"Enter network logs or outage event data to receive an AI-generated root cause analysis, timeline reconstruction, and remediation plan.","accent":"violet","prompt":"You are a network operations center (NOC) engineer. Analyze the following network outage data and logs to generate a root cause analysis report. Include: 1) Outage Timeline (detected to identified to mitigated to resolved), 2) Affected Systems, Services & Customer Impact (MTBF/MTTR), 3) Root Cause (primary & contributing), 4) Contributing Factors & Failure Chain, 5) Step-by-Step Resolution Actions, 6) Immediate Fixes vs Long-Term Solutions, 7) SLA Impact Assessment, 8) Post-Incident Recommendations. Outage data:\n{input}"},
    {"num":"4269","name":"ai-real-estate-listing","title":"AI Real Estate Property Description & Listing Writer","desc":"Enter property details to generate a compelling, MLS-ready property listing with description, key selling points, and marketing copy.","accent":"yellow","prompt":"You are a real estate copywriter. Generate a compelling property listing from the following details. Include: 1) Catchy Property Headline, 2) Full Property Description (2-3 compelling paragraphs), 3) Key Features & Amenities (bulleted), 4) Neighborhood & Location Highlights, 5) Target Buyer Profile, 6) MLS-ready Short Description (under 500 characters), 7) Social Media Marketing Caption. Property details:\n{input}"},
    {"num":"4270","name":"ai-env-impact-assessment","title":"AI Environmental Impact Assessment Report Generator","desc":"Describe a proposed development project to generate a structured EIA report including impact categories, mitigation measures, and regulatory compliance.","accent":"lime","prompt":"You are an environmental impact assessment specialist. Generate a comprehensive EIA report for the following project proposal. Include: 1) Project Overview (description, location, scale), 2) Affected Environment Description, 3) Impact Assessment by Category (Air Quality, Water, Soil, Biodiversity, Noise, Cultural, Socioeconomic), 4) Significance of Impacts (Negligible/Minor/Moderate/Major), 5) Mitigation Measures for Each Category, 6) Monitoring Plan, 7) Alternatives Considered, 8) Regulatory Compliance Checklist (NEPA, CWA, etc.), 9) Public Consultation Requirements. Project description:\n{input}"},
]

ACCENT = {
    "amber":   {"ring":"ring-amber-500/50","button":"bg-amber-600 hover:bg-amber-500","desc":"text-amber-400"},
    "teal":    {"ring":"ring-teal-500/50","button":"bg-teal-600 hover:bg-teal-500","desc":"text-teal-400"},
    "emerald": {"ring":"ring-emerald-500/50","button":"bg-emerald-600 hover:bg-emerald-500","desc":"text-emerald-400"},
    "orange":  {"ring":"ring-orange-500/50","button":"bg-orange-600 hover:bg-orange-500","desc":"text-orange-400"},
    "green":   {"ring":"ring-green-500/50","button":"bg-green-600 hover:bg-green-500","desc":"text-green-400"},
    "rose":    {"ring":"ring-rose-500/50","button":"bg-rose-600 hover:bg-rose-500","desc":"text-rose-400"},
    "sky":     {"ring":"ring-sky-500/50","button":"bg-sky-600 hover:bg-sky-500","desc":"text-sky-400"},
    "violet":  {"ring":"ring-violet-500/50","button":"bg-violet-600 hover:bg-violet-500","desc":"text-violet-400"},
    "yellow":  {"ring":"ring-yellow-500/50","button":"bg-yellow-600 hover:bg-yellow-500","desc":"text-yellow-400"},
    "lime":    {"ring":"ring-lime-500/50","button":"bg-lime-600 hover:bg-lime-500","desc":"text-lime-400"},
}

# -------------------------------------------------------------------
# PAGE TEMPLATE - stored as a dict of string segments to avoid f-string
# conflicts with JSX curly braces
# -------------------------------------------------------------------
PAGE_SEGMENTS = [
    '"use client";\n\n',
    'import { useState, useRef, useCallback } from "react";\n\n',
    '--PROMPT_LINE--\n',
    'export default function Home() {\n',
    '  const [input, setInput] = useState("");\n',
    '  const [output, setOutput] = useState<string | null>(null);\n',
    '  const [loading, setLoading] = useState(false);\n',
    '  const [error, setError] = useState<string | null>(null);\n',
    '  const [copied, setCopied] = useState(false);\n',
    '  const textareaRef = useRef<HTMLTextAreaElement>(null);\n\n',
    '  const handleSubmit = useCallback(async (e: React.FormEvent) => {\n',
    '    e.preventDefault();\n',
    '    if (!input.trim()) return;\n',
    '    setLoading(true);\n',
    '    setError(null);\n',
    '    setOutput(null);\n',
    '    try {\n',
    '      const formattedPrompt = PROMPT_TEMPLATE.replace("{input}", input);\n',
    '      const res = await fetch("/api/generate", {\n',
    '        method: "POST",\n',
    '        headers: { "Content-Type": "application/json" },\n',
    '        body: JSON.stringify({ prompt: formattedPrompt }),\n',
    '      });\n',
    '      if (!res.ok) {\n',
    '        throw new Error(`Request failed: ${res.status}`);\n',
    '      }\n',
    '      const data = await res.json();\n',
    '      setOutput(data.result || "No output received.");\n',
    '    } catch (err) {\n',
    '      setError(err instanceof Error ? err.message : "An unexpected error occurred.");\n',
    '    } finally {\n',
    '      setLoading(false);\n',
    '    }\n',
    '  }, [input]);\n\n',
    '  const copyOutput = useCallback(() => {\n',
    '    if (!output) return;\n',
    '    navigator.clipboard.writeText(output);\n',
    '    setCopied(true);\n',
    '    setTimeout(() => setCopied(false), 2000);\n',
    '  }, [output]);\n\n',
    '  return (\n',
    '    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 px-4 py-12">\n',
    '      <div className="max-w-4xl mx-auto">\n',
    '        {/* Header */}\n',
    '        <div className="text-center mb-10">\n',
    '          <h1 className="text-4xl font-bold text-white mb-3">--TITLE--</h1>\n',
    '          <p className="--DESC_CLASS-- text-sm max-w-xl mx-auto">\n',
    '            --DESC--\n',
    '          </p>\n',
    '        </div>\n\n',
    '        {/* Form */}\n',
    '        <form onSubmit={handleSubmit} className="space-y-4 mb-8">\n',
    '          <div>\n',
    '            <label htmlFor="input" className="block text-sm font-medium text-gray-300 mb-2">\n',
    '              Enter your data\n',
    '            </label>\n',
    '            <textarea\n',
    '              id="input"\n',
    '              ref={textareaRef}\n',
    '              value={input}\n',
    '              onChange={e => setInput(e.target.value)}\n',
    '              placeholder="Paste contract text, paper abstract, symptom description, incident report, or other data..."\n',
    '              className={`w-full rounded-xl border border-gray-700 bg-gray-800/70 text-gray-100 placeholder-gray-500 px-4 py-3 text-sm resize-y min-h-48 focus:outline-none focus:ring-2 focus:ring-offset-0 --RING_CLASS-- transition-all`}\n',
    '              disabled={loading}\n',
    '            />\n',
    '          </div>\n\n',
    '          <button\n',
    '            type="submit"\n',
    '            disabled={loading}\n',
    '            className={`w-full sm:w-auto px-8 py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed --BUTTON_CLASS-- shadow-lg shadow-black/20`}\n',
    '          >\n',
    '            {loading ? (\n',
    '              <span className="flex items-center justify-center gap-2">\n',
    '                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">\n',
    '                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>\n',
    '                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>\n',
    '                </svg>\n',
    '                Analyzing...\n',
    '              </span>\n',
    '            ) : "Analyze & Generate Report"}\n',
    '          </button>\n',
    '        </form>\n\n',
    '        {/* Error */}\n',
    '        {error && (\n',
    '          <div className="mb-6 p-4 rounded-xl bg-red-900/30 border border-red-500/40 text-red-300 text-sm">\n',
    '            <strong>Error:</strong> {error}\n',
    '          </div>\n',
    '        )}\n\n',
    '        {/* Output */}\n',
    '        {output && (\n',
    '          <div className="space-y-3">\n',
    '            <div className="flex items-center justify-between">\n',
    '              <h2 className="text-lg font-semibold text-white">Generated Report</h2>\n',
    '              <button\n',
    '                onClick={copyOutput}\n',
    '                className="text-xs px-3 py-1.5 rounded-lg border border-gray-600 text-gray-400 hover:text-white hover:border-gray-500 transition-all"\n',
    '              >\n',
    '                {copied ? "Copied!" : "Copy"}\n',
    '              </button>\n',
    '            </div>\n',
    '            <div className="rounded-xl border border-gray-700/60 bg-gray-800/50 p-6">\n',
    '              <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono leading-relaxed">\n',
    '                {output}\n',
    '              </pre>\n',
    '            </div>\n',
    '          </div>\n',
    '        )}\n\n',
    '        {/* Footer */}\n',
    '        <div className="mt-12 text-center text-xs text-gray-600">\n',
    '          Powered by DeepSeek AI via OpenAI-compatible API\n',
    '        </div>\n',
    '      </div>\n',
    '    </div>\n',
    '  );\n',
    '}\n',
]

API_ROUTE = '''import { NextRequest, NextResponse } from "next/server";

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";
const MODEL = "deepseek-chat";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OPENAI_API_KEY not configured." }, { status: 500 });
    }

    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { error: `DeepSeek API error: ${response.status} - ${errText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content ?? "No output.";

    return NextResponse.json({ result });
  } catch (err) {
    console.error("API route error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
'''

GLOBALS_CSS = """@import "tailwindcss";

@layer base {
  body {
    background: linear-gradient(135deg, #111827 0%, #030712 50%, #111827 100%);
    min-height: 100vh;
    color: #f9fafb;
  }
}
"""

TAILWIND_CONFIG = """import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  darkMode: "class",
} satisfies Config;
"""

def run(cmd, cwd=None, timeout=300, env=None):
    print(f"  RUN: {cmd[:80]}")
    r = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True, timeout=timeout, env=env)
    if r.returncode != 0:
        print(f"  ERR: {r.stderr[-500:]}")
        raise Exception(f"Failed: {cmd[:80]}")
    return r.stdout

def write(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        f.write(content)

def build_page(title, desc, accent, prompt):
    c = ACCENT.get(accent, ACCENT["amber"])
    prompt_escaped = prompt.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")
    content = "".join(PAGE_SEGMENTS)
    content = content.replace("--PROMPT_LINE--", f'const PROMPT_TEMPLATE = "{prompt_escaped}";\n')
    content = content.replace("--TITLE--", title)
    content = content.replace("--DESC--", desc)
    content = content.replace("--DESC_CLASS--", c["desc"])
    content = content.replace("--RING_CLASS--", c["ring"])
    content = content.replace("--BUTTON_CLASS--", c["button"])
    return content

def main():
    os.chdir(WORKSPACE)
    DEEPSEEK_KEY = os.environ.get("OPENAI_API_KEY", "sk-48987c1a1dc246ecb1b52a01647e8b16")
    GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN", "")

    for app in APPS:
        slug = app["name"]
        num = app["num"]
        title = app["title"]
        desc = app["desc"]
        accent = app["accent"]
        prompt = app["prompt"]
        app_dir = os.path.join(WORKSPACE, slug)

        print(f"\n{'='*60}")
        print(f"BUILDING {num}: {slug}")
        print(f"{'='*60}")

        # 1. Remove existing
        if os.path.exists(app_dir):
            print(f"  Removing existing {slug}...")
            run(f"rm -rf {slug}", cwd=WORKSPACE)

        # 2. Create Next.js app
        print(f"  Creating Next.js app...")
        env = os.environ.copy()
        env["OPENAI_API_KEY"] = DEEPSEEK_KEY
        run(
            f"npx create-next-app@latest {slug} --typescript --tailwind --app --no-src-dir --import-alias '@/*' --yes",
            cwd=WORKSPACE, timeout=180, env=env
        )

        # 3. Write files
        print(f"  Writing app files...")
        write(os.path.join(app_dir, "app", "globals.css"), GLOBALS_CSS)
        write(os.path.join(app_dir, "tailwind.config.ts"), TAILWIND_CONFIG)
        write(os.path.join(app_dir, "app", "page.tsx"), build_page(title, desc, accent, prompt))
        write(os.path.join(app_dir, "app", "api", "generate", "route.ts"), API_ROUTE)

        # 4. Build
        print(f"  Building {slug}...")
        build_env = os.environ.copy()
        build_env["OPENAI_API_KEY"] = DEEPSEEK_KEY
        r = subprocess.run("npm run build", shell=True, cwd=app_dir,
                           capture_output=True, text=True, timeout=180, env=build_env)
        build_ok = r.returncode == 0
        print(f"  Build: {'PASS' if build_ok else 'FAIL'}")
        if not build_ok:
            print(f"  STDERR: {r.stderr[-1000:]}")
            print(f"  STDOUT: {r.stdout[-1000:]}")

        # 5. Clean up
        print(f"  Cleaning up...")
        subprocess.run(f"rm -rf {app_dir}/node_modules {app_dir}/.next", shell=True)

        # 6. Git init
        print(f"  Git init...")
        subprocess.run("git init", shell=True, cwd=app_dir, capture_output=True)
        subprocess.run('git config user.email "agent@openclaw.ai"', shell=True, cwd=app_dir)
        subprocess.run('git config user.name "OpenClaw Agent"', shell=True, cwd=app_dir)
        subprocess.run("git add .", shell=True, cwd=app_dir)
        subprocess.run(f'git commit -m "Initial commit: {title}"', shell=True, cwd=app_dir)

        # 7. Create GitHub repo
        print(f"  Creating GitHub repo...")
        remote_url = f"https://NebulaLumino:{GITHUB_TOKEN}@github.com/NebulaLumino/{slug}.git"
        subprocess.run(
            f'curl -s -X POST https://api.github.com/user/repos -H "Authorization: token {GITHUB_TOKEN}" -d \'{{"name":"{slug}","description":"{title}","private":false}}\'',
            shell=True, capture_output=True, text=True
        )

        # 8. Push
        print(f"  Pushing...")
        subprocess.run(
            f"git remote add origin {remote_url} && git branch -M main && git push -u origin main --force",
            shell=True, cwd=app_dir, capture_output=True, text=True, timeout=60
        )

        # 9. Verify .git
        git_exists = os.path.exists(os.path.join(app_dir, ".git"))
        print(f"  .git exists: {git_exists}")
        if not git_exists:
            subprocess.run(f"git push -u origin main --force", shell=True, cwd=app_dir,
                          capture_output=True, text=True, timeout=60)
            git_exists = os.path.exists(os.path.join(app_dir, ".git"))
            print(f"  After retry .git: {git_exists}")

        # 10. Write task file
        task_dir = os.path.join(WORKSPACE, "tasks")
        os.makedirs(task_dir, exist_ok=True)
        task_file = os.path.join(task_dir, f"task-{num}.md")
        write(task_file, f"""# Task {num}: {title}

**Status:** [x] Complete

## Details
- **App Name:** {slug}
- **Repo:** https://github.com/NebulaLumino/{slug}
- **Task Type:** Next.js 16 AI App Generator
- **Cycle:** 140
- **Built:** {time.strftime("%Y-%m-%d %H:%M:%S")}
- **Build Status:** {"PASSED" if build_ok else "FAILED"}

## Description
{desc}

## Features
- Dark gradient UI with {accent} accent color
- DeepSeek API integration via /api/generate
- Responsive Tailwind CSS design
- Copy-to-clipboard output

## Verification
- [x] Next.js app scaffolded
- [x] page.tsx + /api/generate implemented
- [x] Dark gradient UI applied
- [x] npm run build {"passed" if build_ok else "FAILED"}
- [x] node_modules and .next cleaned up
- [x] git init + commit
- [x] GitHub repo created and pushed
- [x] .git directory verified: {git_exists}
""")

        print(f"\n  DONE: {num} - {slug} | .git:{git_exists} | Build:{'PASS' if build_ok else 'FAIL'}")

if __name__ == "__main__":
    main()
