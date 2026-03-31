#!/usr/bin/env python3
"""Generate all 20 Cycle 18 apps"""
import os, subprocess, json

WORKSPACE = "/Users/nebulalumino/ai-apps"
TOKEN = "[VERCEL_TOKEN_REDACTED]"
DEEPSEEK_KEY = "[DEEPSEEK_API_KEY_REDACTED]"
NEXT_VER = "16.2.1"

APPS = [
    (481, "ai-product-analytics-dashboard", "AI Product Analytics Dashboard",
     "📊", "dashboard"),
    (482, "ai-subscription-revenue-forecast", "AI Subscription Revenue Forecast",
     "📈", "forecast"),
    (483, "ai-customer-support-sla", "AI Customer Support SLA Calculator",
     "🎧", "sla"),
    (484, "ai-gtm-timeline", "AI Go-to-Market Timeline Generator",
     "🚀", "gtm"),
    (485, "ai-brand-asset-generator", "AI Brand Asset Generator",
     "🎨", "brand"),
    (486, "ai-ab-test-calculator", "AI A/B Test Significance Calculator",
     "🔬", "abtest"),
    (487, "ai-legal-nda-generator", "AI Legal NDA Generator",
     "⚖️", "legal"),
    (488, "ai-employee-onboarding", "AI Employee Onboarding Checklist",
     "👋", "onboarding"),
    (489, "ai-crm-data-quality", "AI CRM Data Quality Scanner",
     "🔍", "crm"),
    (490, "ai-roi-calculator", "AI Return on Investment Calculator",
     "💰", "roi"),
    (491, "ai-competitive-analysis-matrix", "AI Competitive Analysis Matrix",
     "📊", "matrix"),
    (492, "ai-user-interview-synthesizer", "AI User Interview Synthesizer",
     "🎙️", "interview"),
    (493, "ai-qa-document-generator", "AI Q&A Document Generator",
     "📝", "qa"),
    (494, "ai-sentiment-analysis-dashboard", "AI Sentiment Analysis Dashboard",
     "💬", "sentiment"),
    (495, "ai-project-risk-register", "AI Project Risk Register",
     "⚠️", "risk"),
    (496, "ai-bio-about-page", "AI Bio/About Page Generator",
     "👤", "bio"),
    (497, "ai-event-agenda-builder", "AI Event Agenda Builder",
     "📅", "event"),
    (498, "ai-charity-impact-calculator", "AI Charity/Donation Impact Calculator",
     "❤️", "charity"),
    (499, "ai-podcast-show-notes", "AI Podcast Show Notes Generator",
     "🎙️", "podcast"),
    (500, "ai-video-timestamp-generator", "AI Video Timestamp Generator",
     "🎬", "video"),
]

# Generic page template
GENERIC_PAGE = '''"use client";
import {{ useState }} from "react";
export default function Home() {{
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [history, setHistory] = useState<{{i:string;o:string}}[]>([]);
  const handleGenerate = async () => {{
    if(!input.trim()) return;
    setLoading(true);
    try {{
      const res = await fetch("/api/generate", {{ method:"POST", headers:{{"Content-Type":"application/json"}}, body:JSON.stringify({{ prompt:input }}) }});
      const data = await res.json();
      setResult(data.result || "Error generating content.");
      setHistory(prev=>[...prev,{{i:input,o:data.result||"Error"}}]);
      setInput("");
    }} catch {{ setResult("Error generating content."); }}
    setLoading(false);
  }};
  return (
    <div style={{{{minHeight:"100vh",padding:"24px",maxWidth:"900px",margin:"0 auto"}}}}>
      <div style={{{{marginBottom:32}}}}>
        <div style={{{{display:"flex",alignItems:"center",gap:12,marginBottom:8}}}}>
          <div style={{{{width:40,height:40,background:"var(--primary)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}}}>{EMOJI}</div>
          <h1 style={{{{fontSize:28,fontWeight:800}}}}>{APP_NAME}</h1>
        </div>
        <p style={{{{color:"var(--text-muted)",fontSize:15}}}}>AI-powered generator powered by DeepSeek</p>
      </div>
      <div className="card" style={{{{marginBottom:24}}}}>
        <textarea value={{input}} onChange={{e=>setInput(e.target.value)}} placeholder="Enter your input..." rows={{6}} style={{{{marginBottom:12}}}} />
        <button className="btn-primary" onClick={{handleGenerate}} disabled={{loading||!input.trim()}} style={{{{width:"100%"}}}}>
          {{loading?"⏳ Generating...":"🚀 Generate"}}
        </button>
      </div>
      {{result&&<div className="card" style={{{{marginBottom:24,whiteSpace:"pre-wrap",lineHeight:1.7,color:"var(--text-muted)",fontSize:14}}}}>{{result}}</div>}}
      <h2 style={{{{fontSize:16,fontWeight:700,marginBottom:12}}}}>History</h2>
      {{history.length===0&&<div className="card" style={{{{textAlign:"center",padding:40}}的因素<h2>Ask a question about your analytics data</h2>
      <button onClick={()=>setQuestion("What is the churn trend?")} className="btn-secondary">Churn trend</button>
      <button onClick={()=>setQuestion("Best performing channel?")} className="btn-secondary">Best channel</button>
    </div>
  );
}}
'''

def create_app(num, slug, name, emoji, app_type):
    app_dir = f"{WORKSPACE}/{slug}"
    print(f"\n=== Creating {slug} ===")
    
    # Create directories
    for d in ["src/app/api/generate", "src/lib"]:
        os.makedirs(f"{app_dir}/{d}", exist_ok=True)
    
    # package.json
    pkg = {
        "name": slug,
        "version": "0.1.0",
        "private": True,
        "scripts": {"dev": "next dev", "build": "next build", "start": "next start"},
        "dependencies": {"next": NEXT_VER, "react": "^19.0.0", "react-dom": "^19.0.0", "openai": "^4.77.0"},
        "devDependencies": {"@types/node": "^20", "@types/react": "^19", "@types/react-dom": "^19", "typescript": "^5", "tailwindcss": "^4.0.0", "@tailwindcss/postcss": "^4.0.0"}
    }
    with open(f"{app_dir}/package.json", "w") as f:
        json.dump(pkg, f, indent=2)
    
    # Config files
    tsconfig = {"compilerOptions":{"lib":["dom","dom.iterable","esnext"],"allowJs":True,"skipLibCheck":True,"strict":True,"noEmit":True,"esModuleInterop":True,"module":"esnext","moduleResolution":"bundler","resolveJsonModule":True,"isolatedModules":True,"jsx":"preserve","incremental":True,"plugins":[{"name":"next"}],"paths":{"@/*":["./src/*"]}},"include":["next-env.d.ts","**/*.ts","**/*.tsx",".next/types/**/*.ts"],"exclude":["node_modules"]}
    with open(f"{app_dir}/tsconfig.json", "w") as f:
        json.dump(tsconfig, f)
    
    with open(f"{app_dir}/next.config.ts", "w") as f:
        f.write('import type { NextConfig } from "next";\nconst nextConfig: NextConfig = { output: "standalone" };\nexport default nextConfig;\n')
    
    with open(f"{app_dir}/postcss.config.mjs", "w") as f:
        f.write("const config = { plugins: { '@tailwindcss/postcss': {} } };\nexport default config;\n")
    
    with open(f"{app_dir}/.gitignore", "w") as f:
        f.write("node_modules/\n.next/\n.vercel/\n.env\n.env.local\n")
    
    with open(f"{app_dir}/.env.local", "w") as f:
        f.write(f"DEEPSEEK_API_KEY={DEEPSEEK_KEY}\n")
    
    # globals.css
    with open(f"{app_dir}/src/app/globals.css", "w") as f:
        f.write('@import "tailwindcss";\n:root{--bg:#0f172a;--surface:#1e293b;--border:#334155;--primary:#6366f1;--primary-hover:#4f46e5;--text:#f8fafc;--text-muted:#94a3b8;--accent:#22d3ee;--success:#22c55e;--warning:#f59e0b;--danger:#ef4444}\n*{box-sizing:border-box}\nbody{background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}\ntextarea,input,select{background:var(--surface);border:1px solid var(--border);color:var(--text);border-radius:8px;padding:10px 14px;width:100%;font-size:14px;outline:none;transition:border-color .2s}\ntextarea:focus,input:focus,select:focus{border-color:var(--primary)}\nbutton{cursor:pointer;border-radius:8px;padding:10px 20px;font-size:14px;font-weight:600;transition:all .2s;border:none}\n.btn-primary{background:var(--primary);color:white}\n.btn-primary:hover{background:var(--primary-hover)}\n.btn-primary:disabled{opacity:.5;cursor:not-allowed}\n.card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px}\n')
    
    # layout.tsx
    with open(f"{app_dir}/src/app/layout.tsx", "w") as f:
        f.write(f'import type {{ Metadata }} from "next";\nimport "./globals.css";\nexport const metadata: Metadata = {{ title: "{name}", description: "AI-powered {name}" }};\nexport default function RootLayout({{ children }}: {{ children: React.ReactNode }}) {{\n  return <html lang="en"><body>{{children}}</body></html>;\n}}\n')
    
    # deepseek.ts
    with open(f"{app_dir}/src/lib/deepseek.ts", "w") as f:
        f.write('import OpenAI from "openai";\nconst deepseek = new OpenAI({{ baseURL: "https://api.deepseek.com/v1", apiKey: process.env.DEEPSEEK_API_KEY }});\nexport default deepseek;\n')
    
    # API route
    with open(f"{app_dir}/src/app/api/generate/route.ts", "w") as f:
        f.write('import { NextRequest, NextResponse } from "next/server";\nimport deepseek from "@/lib/deepseek";\nexport async function POST(req: NextRequest) {{\n  try {{\n    const {{ prompt }} = await req.json();\n    const completion = await deepseek.chat.completions.create({{ model: "deepseek-chat", messages: [{{ role: "user", content: prompt }}], temperature: 0.7 }});\n    return NextResponse.json({{ result: completion.choices[0].message.content }});\n  }} catch (err: any) {{\n    return NextResponse.json({{ error: err.message }}, {{ status: 500 }});\n  }}\n}}\n')
    
    # page.tsx - generic for all
    page = GENERIC_PAGE.format(EMOJI=emoji, APP_NAME=name)
    with open(f"{app_dir}/src/app/page.tsx", "w") as f:
        f.write(page)
    
    print(f"  Files created for {slug}")
    return app_dir

for num, slug, name, emoji, _ in APPS:
    try:
        create_app(num, slug, name, emoji, _)
    except Exception as e:
        print(f"  ERROR creating {slug}: {e}")
