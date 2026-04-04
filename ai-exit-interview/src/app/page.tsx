"use client";

import { useState } from "react";

function renderMarkdown(text: string) {
  return text.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-white mt-7 mb-3 col-span-full">{trimmed.replace("## ","")}</h2>;
    if (trimmed.startsWith("### ")) return <h3 key={i} className="text-sm font-bold text-red-300 mt-4 mb-2">{trimmed.replace("### ","")}</h3>;
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
                <span key={ci} className={`text-xs px-2 py-1 rounded whitespace-nowrap ${ci === 0 ? "bg-red-500/20 text-red-200 font-semibold" : "bg-white/5 text-slate-300"}`}>{cell.trim()}</span>
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
  const [companySize, setCompanySize] = useState("");
  const [industry, setIndustry] = useState("");
  const [rolesToAnalyze, setRolesToAnalyze] = useState("");
  const [departureReason, setDepartureReason] = useState("");
  const [retentionRate, setRetentionRate] = useState("");
  const [exitInterviewGoal, setExitInterviewGoal] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const generate = async () => {
    if (!companySize.trim()) { setError("Company size is required."); return; }
    setLoading(true);
    setError("");
    setResult("");
    setDone(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companySize, industry, rolesToAnalyze, departureReason, retentionRate, exitInterviewGoal }),
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
          <span className="text-3xl">👋</span>
          <div>
            <h1 className="text-xl font-bold text-white">AI Exit Interview Analysis</h1>
            <p className="text-xs text-slate-400">HR analytics · Retention strategy · DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Stop Losing Top Talent — Understand Why They Leave 👋</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">Get a full exit interview framework, question bank, retention strategy, and cost analysis for your organization.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🏢 Company Size *</label>
              <select value={companySize} onChange={(e) => setCompanySize(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-400">
                <option value="" className="bg-slate-800">Select company size...</option>
                <option value="1-10 employees (startup)" className="bg-slate-800">1-10 employees (startup)</option>
                <option value="11-50 employees (early-stage)" className="bg-slate-800">11-50 employees (early-stage)</option>
                <option value="51-200 employees (growth-stage)" className="bg-slate-800">51-200 employees (growth-stage)</option>
                <option value="201-1000 employees (scale-up)" className="bg-slate-800">201-1000 employees (scale-up)</option>
                <option value="1000+ employees (enterprise)" className="bg-slate-800">1000+ employees (enterprise)</option>
              </select>
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🏭 Industry</label>
              <select value={industry} onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-400">
                <option value="" className="bg-slate-800">Select industry...</option>
                <option value="Technology / SaaS" className="bg-slate-800">Technology / SaaS</option>
                <option value="Financial Services / Fintech" className="bg-slate-800">Financial Services / Fintech</option>
                <option value="Healthcare / BioTech" className="bg-slate-800">Healthcare / BioTech</option>
                <option value="E-commerce / Retail" className="bg-slate-800">E-commerce / Retail</option>
                <option value="Professional Services / Consulting" className="bg-slate-800">Professional Services</option>
                <option value="Media / Entertainment" className="bg-slate-800">Media / Entertainment</option>
                <option value="Manufacturing / Logistics" className="bg-slate-800">Manufacturing / Logistics</option>
              </select>
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">👥 Roles to Analyze</label>
              <input value={rolesToAnalyze} onChange={(e) => setRolesToAnalyze(e.target.value)} placeholder="e.g. Engineering, Sales, CS, Marketing"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">📉 Primary Departure Reasons</label>
              <input value={departureReason} onChange={(e) => setDepartureReason(e.target.value)} placeholder="e.g. Career growth, compensation, management"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">📊 Current Retention Rate</label>
              <select value={retentionRate} onChange={(e) => setRetentionRate(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-400">
                <option value="" className="bg-slate-800">Select retention rate...</option>
                <option value="<60% (critical)" className="bg-slate-800">&lt;60% (critical)</option>
                <option value="60-70% (concerning)" className="bg-slate-800">60-70% (concerning)</option>
                <option value="70-80% (average)" className="bg-slate-800">70-80% (average)</option>
                <option value="80-90% (good)" className="bg-slate-800">80-90% (good)</option>
                <option value="90%+ (excellent)" className="bg-slate-800">90%+ (excellent)</option>
              </select>
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🎯 Exit Interview Goal</label>
              <select value={exitInterviewGoal} onChange={(e) => setExitInterviewGoal(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-400">
                <option value="" className="bg-slate-800">Select goal...</option>
                <option value="Understand why people leave" className="bg-slate-800">Understand why people leave</option>
                <option value="Build actionable retention strategies" className="bg-slate-800">Build actionable retention strategies</option>
                <option value="Reduce voluntary turnover" className="bg-slate-800">Reduce voluntary turnover</option>
                <option value="Identify manager-level issues" className="bg-slate-800">Identify manager-level issues</option>
                <option value="Audit compensation competitiveness" className="bg-slate-800">Audit compensation competitiveness</option>
              </select>
            </div>
          </div>

          <button onClick={generate} disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2">
            {loading ? <><span className="animate-spin text-xl">⚙️</span> Analyzing departures...</> : <><span>👋</span> Generate Exit Interview Analysis</>}
          </button>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-5 py-3 text-red-300 text-sm">{error}</div>}

        {done && result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-rose-500/10 border-b border-rose-500/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">👋</span>
                <p className="text-rose-300 font-bold text-sm">Exit Interview Analysis Report</p>
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

        <p className="text-center text-xs text-slate-600">AI Exit Interview Analysis · {new Date().getFullYear()} · DeepSeek</p>
      </div>
    </main>
  );
}
