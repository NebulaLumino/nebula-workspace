#!/usr/bin/env python3
"""Generate all 20 Cycle 18 apps and optionally deploy"""
import os, sys, json, subprocess, time

WORKSPACE = "/Users/nebulalumino/ai-apps"
TOKEN = "[VERCEL_TOKEN_REDACTED]"
DEEPSEEK_KEY = "[DEEPSEEK_API_KEY_REDACTED]"
NEXT_VER = "16.2.1"

APPS = [
    (481, "ai-product-analytics-dashboard", "AI Product Analytics Dashboard", "📊"),
    (482, "ai-subscription-revenue-forecast", "AI Subscription Revenue Forecast", "📈"),
    (483, "ai-customer-support-sla", "AI Customer Support SLA Calculator", "🎧"),
    (484, "ai-gtm-timeline", "AI Go-to-Market Timeline Generator", "🚀"),
    (485, "ai-brand-asset-generator", "AI Brand Asset Generator", "🎨"),
    (486, "ai-ab-test-calculator", "AI A/B Test Significance Calculator", "🔬"),
    (487, "ai-legal-nda-generator", "AI Legal NDA Generator", "⚖️"),
    (488, "ai-employee-onboarding", "AI Employee Onboarding Checklist", "👋"),
    (489, "ai-crm-data-quality", "AI CRM Data Quality Scanner", "🔍"),
    (490, "ai-roi-calculator", "AI Return on Investment Calculator", "💰"),
    (491, "ai-competitive-analysis-matrix", "AI Competitive Analysis Matrix", "📊"),
    (492, "ai-user-interview-synthesizer", "AI User Interview Synthesizer", "🎙️"),
    (493, "ai-qa-document-generator", "AI Q&A Document Generator", "📝"),
    (494, "ai-sentiment-analysis-dashboard", "AI Sentiment Analysis Dashboard", "💬"),
    (495, "ai-project-risk-register", "AI Project Risk Register", "⚠️"),
    (496, "ai-bio-about-page", "AI Bio/About Page Generator", "👤"),
    (497, "ai-event-agenda-builder", "AI Event Agenda Builder", "📅"),
    (498, "ai-charity-impact-calculator", "AI Charity/Donation Impact Calculator", "❤️"),
    (499, "ai-podcast-show-notes", "AI Podcast Show Notes Generator", "🎙️"),
    (500, "ai-video-timestamp-generator", "AI Video Timestamp Generator", "🎬"),
]

PAGE_TEMPLATE = '''"use client";
import { useState } from "react";
export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [history, setHistory] = useState<{i:string;o:string}[]>([]);
  const handleGenerate = async () => {
    if(!input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ prompt:input }) });
      const data = await res.json();
      setResult(data.result || "Error generating content.");
      setHistory(prev=>[...prev,{i:input,o:data.result||"Error"}]);
      setInput("");
    } catch { setResult("Error generating content."); }
    setLoading(false);
  };
  return (
    <div style={{minHeight:"100vh",padding:"24px",maxWidth:"900px",margin:"0 auto"}}>
      <div style={{marginBottom:32}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
          <div style={{width:40,height:40,background:"var(--primary)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>EMOJI_PLACEHOLDER</div>
          <h1 style={{fontSize:28,fontWeight:800}}>APP_NAME_PLACEHOLDER</h1>
        </div>
        <p style={{color:"var(--text-muted)",fontSize:15}}>AI-powered generator powered by DeepSeek</p>
      </div>
      <div className="card" style={{marginBottom:24}}>
        <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Enter your input..." rows={6} style={{marginBottom:12}} />
        <button className="btn-primary" onClick={handleGenerate} disabled={loading||!input.trim()} style={{width:"100%"}}>
          {loading?"Generating...":"Generate"}
        </button>
      </div>
      {result&&<div className="card" style={{marginBottom:24,whiteSpace:"pre-wrap",lineHeight:1.7,color:"var(--text-muted)",fontSize:14}}>{result}</div>}
      <h2 style={{fontSize:16,fontWeight:700,marginBottom:12}}>History</h2>
      {history.length===0&&<div className="card" style={{textAlign:"center",padding:40,color:"var(--text-muted)"}}><p>Your generated content will appear here.</p></div>}
      {history.map((h,i)=>(
        <div key={i} className="card" style={{marginBottom:12}}>
          <div style={{fontSize:12,color:"var(--primary)",fontWeight:600,marginBottom:6}}>INPUT</div>
          <div style={{fontSize:13,marginBottom:12,color:"var(--text-muted)"}}>{h.i}</div>
          <div style={{fontSize:12,color:"var(--accent)",fontWeight:600,marginBottom:6}}>OUTPUT</div>
          <div style={{fontSize:13,whiteSpace:"pre-wrap",lineHeight:1.6}}>{h.o}</div>
        </div>
      ))}
    </div>
  );
}'''

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        f.write(content)

def create_app(num, slug, name, emoji):
    app_dir = f"{WORKSPACE}/{slug}"
    print(f"\n{'='*50}")
    print(f"Creating {slug} (task-{num})")
    
    # package.json
    pkg = {
        "name": slug,
        "version": "0.1.0",
        "private": True,
        "scripts": {"dev": "next dev", "build": "next build", "start": "next start"},
        "dependencies": {"next": NEXT_VER, "react": "^19.0.0", "react-dom": "^19.0.0", "openai": "^4.77.0"},
        "devDependencies": {"@types/node": "^20", "@types/react": "^19", "@types/react-dom": "^19", "typescript": "^5", "tailwindcss": "^4.0.0", "@tailwindcss/postcss": "^4.0.0"}
    }
    write_file(f"{app_dir}/package.json", json.dumps(pkg, indent=2))
    
    tsconfig = {"compilerOptions":{"lib":["dom","dom.iterable","esnext"],"allowJs":True,"skipLibCheck":True,"strict":True,"noEmit":True,"esModuleInterop":True,"module":"esnext","moduleResolution":"bundler","resolveJsonModule":True,"isolatedModules":True,"jsx":"preserve","incremental":True,"plugins":[{"name":"next"}],"paths":{"@/*":["./src/*"]}},"include":["next-env.d.ts","**/*.ts","**/*.tsx",".next/types/**/*.ts"],"exclude":["node_modules"]}
    write_file(f"{app_dir}/tsconfig.json", json.dumps(tsconfig))
    write_file(f"{app_dir}/next.config.ts", 'import type { NextConfig } from "next";\nconst nextConfig: NextConfig = { output: "standalone" };\nexport default nextConfig;\n')
    write_file(f"{app_dir}/postcss.config.mjs", "const config = { plugins: { '@tailwindcss/postcss': {} } };\nexport default config;\n")
    write_file(f"{app_dir}/.gitignore", "node_modules/\n.next/\n.vercel/\n.env\n.env.local\n")
    write_file(f"{app_dir}/.env.local", f"DEEPSEEK_API_KEY={DEEPSEEK_KEY}\n")
    
    css = '@import "tailwindcss";\n:root{--bg:#0f172a;--surface:#1e293b;--border:#334155;--primary:#6366f1;--primary-hover:#4f46e5;--text:#f8fafc;--text-muted:#94a3b8;--accent:#22d3ee;--success:#22c55e;--warning:#f59e0b;--danger:#ef4444}\n*{box-sizing:border-box}\nbody{background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}\ntextarea,input,select{background:var(--surface);border:1px solid var(--border);color:var(--text);border-radius:8px;padding:10px 14px;width:100%;font-size:14px;outline:none;transition:border-color .2s}\ntextarea:focus,input:focus,select:focus{border-color:var(--primary)}\nbutton{cursor:pointer;border-radius:8px;padding:10px 20px;font-size:14px;font-weight:600;transition:all .2s;border:none}\n.btn-primary{background:var(--primary);color:white}\n.btn-primary:hover{background:var(--primary-hover)}\n.btn-primary:disabled{opacity:.5;cursor:not-allowed}\n.card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px}\n'
    write_file(f"{app_dir}/src/app/globals.css", css)
    
    write_file(f"{app_dir}/src/app/layout.tsx", f'import type {{ Metadata }} from "next";\nimport "./globals.css";\nexport const metadata: Metadata = {{ title: "{name}", description: "AI-powered {name}" }};\nexport default function RootLayout({{ children }}: {{ children: React.ReactNode }}) {{\n  return <html lang="en"><body>{{children}}</body></html>;\n}}\n')
    
    write_file(f"{app_dir}/src/lib/deepseek.ts", 'import OpenAI from "openai";\nconst deepseek = new OpenAI({ baseURL: "https://api.deepseek.com/v1", apiKey: process.env.DEEPSEEK_API_KEY });\nexport default deepseek;\n')
    
    write_file(f"{app_dir}/src/app/api/generate/route.ts", 'import { NextRequest, NextResponse } from "next/server";\nimport deepseek from "@/lib/deepseek";\nexport async function POST(req: NextRequest) {\n  try {\n    const { prompt } = await req.json();\n    const completion = await deepseek.chat.completions.create({ model: "deepseek-chat", messages: [{ role: "user", content: prompt }], temperature: 0.7 });\n    return NextResponse.json({ result: completion.choices[0].message.content });\n  } catch (err: any) {\n    return NextResponse.json({ error: err.message }, { status: 500 });\n  }\n}\n')
    
    page = PAGE_TEMPLATE.replace("EMOJI_PLACEHOLDER", emoji).replace("APP_NAME_PLACEHOLDER", name)
    write_file(f"{app_dir}/src/app/page.tsx", page)
    
    print(f"  Files created.")

def install_and_push(slug):
    app_dir = f"{WORKSPACE}/{slug}"
    print(f"  Installing deps...")
    r = subprocess.run(["npm", "install"], cwd=app_dir, capture_output=True, text=True, timeout=120)
    if r.returncode != 0:
        print(f"  INSTALL FAILED: {r.stderr[-200:]}")
        return False
    print(f"  Deps installed.")
    
    # Git init/push
    print(f"  Git push...")
    is_new = not os.path.exists(f"{app_dir}/.git")
    cmds = []
    if is_new:
        cmds = [
            ["git", "init"],
            ["git", "add", "-A"],
            ["git", "commit", "-m", f"Initial commit: {slug}"],
            ["git", "branch", "-M", "main"],
        ]
    else:
        cmds = [["git", "add", "-A"], ["git", "commit", "-m", f"Update: {slug}"], ["git", "push", "origin", "main"]]
    
    for cmd in cmds:
        r = subprocess.run(cmd, cwd=app_dir, capture_output=True, text=True, timeout=30)
        if r.returncode != 0 and "nothing to commit" not in r.stdout.lower():
            if "git init" in str(cmd) and "reinitialize" in r.stdout.lower():
                continue
            print(f"  GIT {' '.join(cmd)} FAILED: {r.stderr[-200:]}")
    
    if is_new:
        r = subprocess.run(["gh", "repo", "create", slug, "--public", "--source=.", "--push"],
                          cwd=app_dir, capture_output=True, text=True, timeout=60)
        if r.returncode != 0 and "already exists" not in r.stderr.lower():
            print(f"  GH CREATE FAILED: {r.stderr[-200:]}")
        else:
            print(f"  GitHub repo created.")
    
    return True

def vercel_deploy(slug):
    app_dir = f"{WORKSPACE}/{slug}"
    print(f"  Vercel deploy...")
    # Add env var first
    r = subprocess.run(
        ["vercel", "env", "add", "DEEPSEEK_API_KEY", "production", "--token", TOKEN,
         "--cwd", app_dir, "--value", DEEPSEEK_KEY, "--yes"],
        capture_output=True, text=True, timeout=30
    )
    # Deploy
    r = subprocess.run(
        ["vercel", "--prod", "--yes", "--token", TOKEN, "--cwd", app_dir],
        capture_output=True, text=True, timeout=180
    )
    output = r.stdout + r.stderr
    # Find URL
    for line in output.split("\n"):
        if "vercel.app" in line and "Production:" in line:
            print(f"  DEPLOYED: {line.strip()}")
            return
    # Check for errors
    if r.returncode != 0:
        print(f"  DEPLOY ERROR: {output[-300:]}")
    else:
        for line in output.split("\n"):
            if "vercel.app" in line:
                print(f"  {line.strip()}")

if __name__ == "__main__":
    deploy = "--deploy" in sys.argv
    
    for num, slug, name, emoji in APPS:
        create_app(num, slug, name, emoji)
        if deploy:
            install_and_push(slug)
            vercel_deploy(slug)
        else:
            print("  (skipping install/push/deploy - use --deploy to enable)")
