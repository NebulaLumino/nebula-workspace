"use client";

import { useState } from "react";

function renderMarkdown(text: string) {
  return text.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-white mt-7 mb-3 col-span-full">{trimmed.replace("## ","")}</h2>;
    if (trimmed.startsWith("### Persona")) return <h3 key={i} className="text-base font-bold text-violet-300 mt-5 mb-2">{trimmed}</h3>;
    if (trimmed.startsWith("### ")) return <h3 key={i} className="text-sm font-bold text-amber-300 mt-4 mb-2">{trimmed.replace("### ","")}</h3>;
    if (trimmed.startsWith("**Minutes")) return <p key={i} className="text-amber-200 font-semibold text-xs mt-2 mb-1">{trimmed.replace(/\*\*/g,"")}</p>;
    if (trimmed.startsWith("**") && !trimmed.includes("\n")) return <p key={i} className="text-amber-200 font-semibold text-xs mt-2 mb-0.5">{trimmed.replace(/\*\*/g,"")}</p>;
    if (trimmed.startsWith("- ")) return <li key={i} className="text-slate-300 text-xs ml-4 mb-0.5 list-disc">{trimmed.replace("- ","")}</li>;
    if (/^\d+\.\s/.test(trimmed) && !trimmed.includes("|")) return <li key={i} className="text-slate-300 text-xs ml-4 mb-0.5">{trimmed}</li>;
    if (trimmed === "") return <div key={i} className="h-1.5" />;
    return <p key={i} className="text-slate-300 text-xs leading-relaxed mb-0.5">{trimmed}</p>;
  });
}

export default function Home() {
  const [businessType, setBusinessType] = useState("");
  const [targetCustomer, setTargetCustomer] = useState("");
  const [productStage, setProductStage] = useState("");
  const [interviewGoal, setInterviewGoal] = useState("");
  const [numPersonas, setNumPersonas] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const generate = async () => {
    if (!businessType.trim()) { setError("Business type is required."); return; }
    setLoading(true);
    setError("");
    setResult("");
    setDone(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessType, targetCustomer, productStage, interviewGoal, numPersonas }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Generation failed."); return; }
      setResult(data.result);
      setDone(true);
    } catch { setError("Failed to connect."); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950">
      <header className="border-b border-white/10 sticky top-0 z-10 bg-slate-950/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">🎙️</span>
          <div>
            <h1 className="text-xl font-bold text-white">AI Persona Interview Questions</h1>
            <p className="text-xs text-slate-400">UX research · Customer discovery · DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Interview Your Customers Like a Pro 🎙️</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">Get comprehensive interview question banks per persona, a full 60-min interview script, and research best practices.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🏢 Business Type *</label>
              <input value={businessType} onChange={(e) => setBusinessType(e.target.value)} placeholder="e.g. SaaS project tool, fintech app, e-commerce brand"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">👥 Target Customer</label>
              <input value={targetCustomer} onChange={(e) => setTargetCustomer(e.target.value)} placeholder="e.g. Marketing managers, startup founders, enterprise IT teams"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🚀 Product Stage</label>
              <select value={productStage} onChange={(e) => setProductStage(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-400">
                <option value="" className="bg-slate-800">Select stage...</option>
                <option value="Pre-launch (building the product)" className="bg-slate-800">Pre-launch (building)</option>
                <option value="Early stage (0-1 year, validating PMF)" className="bg-slate-800">Early stage (validating PMF)</option>
                <option value="Growth stage (scaling, optimizing)" className="bg-slate-800">Growth stage (scaling)</option>
                <option value="Mature product (defending, expanding)" className="bg-slate-800">Mature product</option>
              </select>
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🎯 Interview Goal</label>
              <select value={interviewGoal} onChange={(e) => setInterviewGoal(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-400">
                <option value="" className="bg-slate-800">Select goal...</option>
                <option value="Understand pain points and frustrations" className="bg-slate-800">Understand pain points</option>
                <option value="Validate product-market fit" className="bg-slate-800">Validate product-market fit</option>
                <option value="Identify features for roadmap" className="bg-slate-800">Identify features for roadmap</option>
                <option value="Reduce churn and improve retention" className="bg-slate-800">Reduce churn</option>
                <option value="Understand buyer vs user gap" className="bg-slate-800">Understand buyer vs user gap</option>
                <option value="General customer discovery" className="bg-slate-800">General customer discovery</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-white font-semibold text-sm block mb-2">🧑‍🤝‍🧑 Number of Distinct Personas</label>
              <select value={numPersonas} onChange={(e) => setNumPersonas(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-400">
                <option value="" className="bg-slate-800">Select number...</option>
                <option value="1 persona" className="bg-slate-800">1 persona</option>
                <option value="2 personas" className="bg-slate-800">2 personas</option>
                <option value="3 personas" className="bg-slate-800">3 personas</option>
                <option value="4+ personas" className="bg-slate-800">4+ personas</option>
              </select>
            </div>
          </div>

          <button onClick={generate} disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2">
            {loading ? <><span className="animate-spin text-xl">⚙️</span> Building questions...</> : <><span>🎙️</span> Generate Interview Questions</>}
          </button>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-5 py-3 text-red-300 text-sm">{error}</div>}

        {done && result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-violet-500/10 border-b border-violet-500/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎙️</span>
                <p className="text-violet-300 font-bold text-sm">Interview Questions: {businessType}</p>
              </div>
              <button onClick={() => navigator.clipboard?.writeText(result)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-xs border border-white/10 transition-all">
                📋 Copy All
              </button>
            </div>
            <div className="px-6 py-5">
              {renderMarkdown(result)}
            </div>
          </div>
        )}

        <p className="text-center text-xs text-slate-600">AI Persona Interview Questions Generator · {new Date().getFullYear()} · DeepSeek</p>
      </div>
    </main>
  );
}
