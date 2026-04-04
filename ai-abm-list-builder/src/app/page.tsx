"use client";

import { useState } from "react";

function renderMarkdown(text: string) {
  return text.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-white mt-7 mb-3 col-span-full">{trimmed.replace("## ","")}</h2>;
    if (trimmed.startsWith("### Tier")) return <h3 key={i} className="text-base font-bold text-indigo-300 mt-5 mb-2">{trimmed}</h3>;
    if (trimmed.startsWith("### ")) return <h3 key={i} className="text-sm font-bold text-amber-300 mt-4 mb-2">{trimmed.replace("### ","")}</h3>;
    if (trimmed.startsWith("**") && !trimmed.includes("\n")) return <p key={i} className="text-amber-200 font-semibold text-xs mt-2 mb-0.5">{trimmed.replace(/\*\*/g,"")}</p>;
    if (trimmed.startsWith("- ")) return <li key={i} className="text-slate-300 text-xs ml-4 mb-0.5 list-disc">{trimmed.replace("- ","")}</li>;
    if (/^\d+\.\s/.test(trimmed) && !trimmed.includes("|")) return <li key={i} className="text-slate-300 text-xs ml-4 mb-0.5">{trimmed}</li>;
    if (trimmed.startsWith("|")) {
      const cells = trimmed.split("|").filter(c => c.trim() && c.trim() !== "---");
      if (cells.length > 1) {
        return (
          <div key={i} className="overflow-x-auto mb-1">
            <div className="flex gap-1 min-w-max">
              {cells.map((cell, ci) => (
                <span key={ci} className={`text-xs px-2 py-1 rounded whitespace-nowrap ${ci === 0 ? "bg-indigo-500/20 text-indigo-200 font-semibold" : "bg-white/5 text-slate-300"}`}>{cell.trim()}</span>
              ))}
            </div>
          </div>
        );
      }
      return null;
    }
    if (trimmed === "") return <div key={i} className="h-1.5" />;
    return <p key={i} className="text-slate-300 text-xs leading-relaxed mb-0.5">{trimmed}</p>;
  });
}

export default function Home() {
  const [companyType, setCompanyType] = useState("");
  const [targetGeography, setTargetGeography] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [industry, setIndustry] = useState("");
  const [dealValue, setDealValue] = useState("");
  const [techStack, setTechStack] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const generate = async () => {
    if (!companyType.trim()) { setError("Company type / ICP is required."); return; }
    setLoading(true);
    setError("");
    setResult("");
    setDone(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyType, targetGeography, companySize, industry, dealValue, techStack }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Generation failed."); return; }
      setResult(data.result);
      setDone(true);
    } catch { setError("Failed to connect."); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <header className="border-b border-white/10 sticky top-0 z-10 bg-slate-950/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">🎯</span>
          <div>
            <h1 className="text-xl font-bold text-white">AI ABM List Builder</h1>
            <p className="text-xs text-slate-400">Account-based marketing · Target accounts · DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Build Precision ABM Lists That Actually Convert 🎯</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">Get a tiered target account list, ICP definition, scoring model, outreach strategy, and ABM tool recommendations.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🎯 Company Type / ICP *</label>
              <input value={companyType} onChange={(e) => setCompanyType(e.target.value)} placeholder="e.g. Mid-market SaaS companies using HubSpot, Series B-C fintech startups"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🌍 Target Geography</label>
              <input value={targetGeography} onChange={(e) => setTargetGeography(e.target.value)} placeholder="e.g. North America, EMEA, United States, Global"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">👥 Company Size</label>
              <select value={companySize} onChange={(e) => setCompanySize(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                <option value="" className="bg-slate-800">Select size...</option>
                <option value="10-50 employees (SMB)" className="bg-slate-800">10-50 employees (SMB)</option>
                <option value="50-200 employees (mid-market)" className="bg-slate-800">50-200 employees (mid-market)</option>
                <option value="200-500 employees (upper mid-market)" className="bg-slate-800">200-500 employees (upper mid-market)</option>
                <option value="500-2000 employees (enterprise)" className="bg-slate-800">500-2000 employees (enterprise)</option>
                <option value="2000+ employees (large enterprise)" className="bg-slate-800">2000+ employees (large enterprise)</option>
              </select>
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🏭 Industry / Vertical</label>
              <input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. SaaS, Fintech, Healthcare, e-Commerce, Manufacturing"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">💰 Target Deal Value</label>
              <select value={dealValue} onChange={(e) => setDealValue(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                <option value="" className="bg-slate-800">Select deal value...</option>
                <option value="$1K-$5K ACV" className="bg-slate-800">$1K-$5K ACV</option>
                <option value="$5K-$25K ACV" className="bg-slate-800">$5K-$25K ACV</option>
                <option value="$25K-$100K ACV" className="bg-slate-800">$25K-$100K ACV</option>
                <option value="$100K-$500K ACV" className="bg-slate-800">$100K-$500K ACV</option>
                <option value="$500K+ ACV" className="bg-slate-800">$500K+ ACV</option>
              </select>
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🛠️ Tech Stack / Signals</label>
              <input value={techStack} onChange={(e) => setTechStack(e.target.value)} placeholder="e.g. Companies using Salesforce + Slack, recent HubSpot customers"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
          </div>

          <button onClick={generate} disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2">
            {loading ? <><span className="animate-spin text-xl">⚙️</span> Building account list...</> : <><span>🎯</span> Build ABM Account List</>}
          </button>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-5 py-3 text-red-300 text-sm">{error}</div>}

        {done && result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-indigo-500/10 border-b border-indigo-500/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <p className="text-indigo-300 font-bold text-sm">ABM Account List: {companyType}</p>
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

        <p className="text-center text-xs text-slate-600">AI ABM List Builder · {new Date().getFullYear()} · DeepSeek</p>
      </div>
    </main>
  );
}
