"use client";

import { useState } from "react";

function renderMarkdown(text: string) {
  return text.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-white mt-7 mb-3 col-span-full">{trimmed.replace("## ","")}</h2>;
    if (trimmed.startsWith("### ")) return <h3 key={i} className="text-sm font-bold text-amber-300 mt-4 mb-2">{trimmed.replace("### ","")}</h3>;
    if (trimmed.startsWith("**") && !trimmed.includes("\n")) return <p key={i} className="text-amber-200 font-semibold text-xs mt-2 mb-0.5">{trimmed.replace(/\*\*/g,"")}</p>;
    if (trimmed.startsWith("- ")) return <li key={i} className="text-slate-300 text-xs ml-4 mb-0.5 list-disc">{trimmed.replace("- ","")}</li>;
    if (/^\d+\.\s/.test(trimmed)) return <li key={i} className="text-slate-300 text-xs ml-4 mb-0.5">{trimmed}</li>;
    if (trimmed === "") return <div key={i} className="h-1.5" />;
    return <p key={i} className="text-slate-300 text-xs leading-relaxed mb-0.5">{trimmed}</p>;
  });
}

export default function Home() {
  const [companyName, setCompanyName] = useState("");
  const [salesTeamSize, setSalesTeamSize] = useState("");
  const [productType, setProductType] = useState("");
  const [targetSegments, setTargetSegments] = useState("");
  const [currentTerritories, setCurrentTerritories] = useState("");
  const [numReps, setNumReps] = useState("");
  const [numTerritories, setNumTerritories] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const generate = async () => {
    if (!companyName.trim()) { setError("Company name is required."); return; }
    setLoading(true);
    setError("");
    setResult("");
    setDone(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, salesTeamSize, productType, targetSegments, currentTerritories, numReps, numTerritories }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Generation failed."); return; }
      setResult(data.result);
      setDone(true);
    } catch { setError("Failed to connect."); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950">
      <header className="border-b border-white/10 sticky top-0 z-10 bg-slate-950/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">🗺️</span>
          <div>
            <h1 className="text-xl font-bold text-white">AI Sales Territory Planner</h1>
            <p className="text-xs text-slate-400">Sales ops · Territory design · DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Design Territories That Drive Fair, Achievable Quotas 🗺️</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">Generate complete sales territory plans: territory definitions, account tiering, quota allocation, routing rules, and growth roadmap.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🏢 Company *</label>
              <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. NovaTask Inc., DataFlow Corp"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">👥 Sales Team Size</label>
              <input value={salesTeamSize} onChange={(e) => setSalesTeamSize(e.target.value)} placeholder="e.g. 10 reps, 25 reps"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">📦 Product Type</label>
              <input value={productType} onChange={(e) => setProductType(e.target.value)} placeholder="e.g. B2B SaaS, PLG + SLG, Enterprise"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🎯 Target Segments</label>
              <input value={targetSegments} onChange={(e) => setTargetSegments(e.target.value)} placeholder="e.g. Mid-market SaaS, FinTech, Healthcare"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🗺️ Current Territories</label>
              <input value={currentTerritories} onChange={(e) => setCurrentTerritories(e.target.value)} placeholder="e.g. East/West/Central — not working well"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🔢 # of Sales Reps</label>
              <input value={numReps} onChange={(e) => setNumReps(e.target.value)} placeholder="e.g. 10 reps"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-400" />
            </div>
            <div className="md:col-span-2">
              <label className="text-white font-semibold text-sm block mb-2">🗺️ # of Territories to Create</label>
              <input value={numTerritories} onChange={(e) => setNumTerritories(e.target.value)} placeholder="e.g. 5-6 territories"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-400" />
            </div>
          </div>

          <button onClick={generate} disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2">
            {loading ? <><span className="animate-spin text-xl">⚙️</span> Planning territories...</> : <><span>🗺️</span> Generate Territory Plan</>}
          </button>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-5 py-3 text-red-300 text-sm">{error}</div>}

        {done && result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-rose-500/10 border-b border-rose-500/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🗺️</span>
                <p className="text-rose-300 font-bold text-sm">Territory Plan: {companyName}</p>
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

        <p className="text-center text-xs text-slate-600">AI Sales Territory Planner · {new Date().getFullYear()} · DeepSeek</p>
      </div>
    </main>
  );
}
