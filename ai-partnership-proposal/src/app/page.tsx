"use client";

import { useState } from "react";

function renderMarkdown(text: string) {
  return text.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-white mt-7 mb-3 col-span-full">{trimmed.replace("## ","")}</h2>;
    if (trimmed.startsWith("### Option")) return <h3 key={i} className="text-base font-bold text-violet-300 mt-4 mb-2">{trimmed}</h3>;
    if (trimmed.startsWith("### ")) return <h3 key={i} className="text-sm font-bold text-amber-300 mt-4 mb-2">{trimmed.replace("### ","")}</h3>;
    if (trimmed.startsWith("**") && !trimmed.includes("\n")) return <p key={i} className="text-amber-200 font-semibold text-xs mt-2 mb-0.5">{trimmed.replace(/\*\*/g,"")}</p>;
    if (trimmed.startsWith("- ")) return <li key={i} className="text-slate-300 text-xs ml-4 mb-0.5 list-disc">{trimmed.replace("- ","")}</li>;
    if (/^\d+\.\s/.test(trimmed)) return <li key={i} className="text-slate-300 text-xs ml-4 mb-0.5">{trimmed}</li>;
    if (trimmed.startsWith("|")) {
      const cells = trimmed.split("|").filter(c => c.trim() && c.trim() !== "---");
      if (cells.length > 1) {
        return (
          <div key={i} className="overflow-x-auto mb-1">
            <div className="flex gap-2 min-w-max">
              {cells.map((cell, ci) => (
                <span key={ci} className={`text-xs px-2 py-1 rounded whitespace-nowrap ${ci === 0 ? "bg-violet-500/20 text-violet-200 font-semibold" : "bg-white/5 text-slate-300"}`}>{cell.trim()}</span>
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
  const [yourCompany, setYourCompany] = useState("");
  const [partnerCompany, setPartnerCompany] = useState("");
  const [partnershipType, setPartnershipType] = useState("Strategic business partnership");
  const [mutualGoals, setMutualGoals] = useState("");
  const [dealValue, setDealValue] = useState("");
  const [timeline, setTimeline] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const generate = async () => {
    if (!yourCompany.trim() || !partnerCompany.trim()) { setError("Both company names are required."); return; }
    setLoading(true);
    setError("");
    setResult("");
    setDone(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ yourCompany, partnerCompany, partnershipType, mutualGoals, dealValue, timeline }),
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
          <span className="text-3xl">🤝</span>
          <div>
            <h1 className="text-xl font-bold text-white">AI Partnership Proposal Generator</h1>
            <p className="text-xs text-slate-400">B2B deals · Strategic alliances · DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Close Bigger Deals with Less Effort 🤝</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">Generate a complete, professional partnership proposal with deal terms, KPIs, and implementation timelines.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🏢 Your Company *</label>
              <input value={yourCompany} onChange={(e) => setYourCompany(e.target.value)} placeholder="e.g. NovaTask, DataSync Pro, CloudStack"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🤝 Target Partner Company *</label>
              <input value={partnerCompany} onChange={(e) => setPartnerCompany(e.target.value)} placeholder="e.g. Stripe, HubSpot, Notion, Vercel"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🔗 Partnership Type</label>
              <select value={partnershipType} onChange={(e) => setPartnershipType(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-400">
                <option value="Strategic business partnership" className="bg-slate-800">Strategic business partnership</option>
                <option value="Co-marketing partnership" className="bg-slate-800">Co-marketing partnership</option>
                <option value="Referral partnership" className="bg-slate-800">Referral partnership</option>
                <option value="Distribution/reseller partnership" className="bg-slate-800">Distribution / Reseller partnership</option>
                <option value="Technology integration partnership" className="bg-slate-800">Technology integration partnership</option>
                <option value="Content partnership" className="bg-slate-800">Content partnership</option>
                <option value="Channel partnership" className="bg-slate-800">Channel partnership</option>
              </select>
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">💰 Estimated Deal Value</label>
              <input value={dealValue} onChange={(e) => setDealValue(e.target.value)} placeholder="e.g. $50K MRR, 20% revenue share, TBD"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">📅 Target Timeline</label>
              <input value={timeline} onChange={(e) => setTimeline(e.target.value)} placeholder="e.g. Q2-Q3 2026, 6-month pilot, ASAP"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🎯 Mutual Goals</label>
              <input value={mutualGoals} onChange={(e) => setMutualGoals(e.target.value)} placeholder="e.g. Lead gen, brand awareness, market expansion"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-400" />
            </div>
          </div>

          <button onClick={generate} disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2">
            {loading ? <><span className="animate-spin text-xl">⚙️</span> Drafting proposal...</> : <><span>🤝</span> Generate Partnership Proposal</>}
          </button>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-5 py-3 text-red-300 text-sm">{error}</div>}

        {done && result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-violet-500/10 border-b border-violet-500/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🤝</span>
                <p className="text-violet-300 font-bold text-sm">Partnership Proposal: {yourCompany} × {partnerCompany}</p>
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

        <p className="text-center text-xs text-slate-600">AI Partnership Proposal Generator · {new Date().getFullYear()} · DeepSeek</p>
      </div>
    </main>
  );
}
