"use client";

import { useState } from "react";

function renderMarkdown(text: string) {
  return text.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-white mt-7 mb-3 col-span-full">{trimmed.replace("## ","")}</h2>;
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
                <span key={ci} className={`text-xs px-2 py-1 rounded whitespace-nowrap ${ci === 0 ? "bg-orange-500/20 text-orange-200 font-semibold" : "bg-white/5 text-slate-300"}`}>{cell.trim()}</span>
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
  const [yourProduct, setYourProduct] = useState("");
  const [competitors, setCompetitors] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [dealStage, setDealStage] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const generate = async () => {
    if (!yourProduct.trim()) { setError("Product name is required."); return; }
    setLoading(true);
    setError("");
    setResult("");
    setDone(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ yourProduct, competitors, targetAudience, dealStage, productCategory }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Generation failed."); return; }
      setResult(data.result);
      setDone(true);
    } catch { setError("Failed to connect."); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950">
      <header className="border-b border-white/10 sticky top-0 z-10 bg-slate-950/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">⚔️</span>
          <div>
            <h1 className="text-xl font-bold text-white">AI Competitive Battle Cards</h1>
            <p className="text-xs text-slate-400">Sales enablement · Competitive intel · DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Win Against Any Competitor, Every Time ⚔️</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">Generate complete battle cards: competitor profiles, objection handling, positioning matrix, and sales playbook.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🏷️ Your Product *</label>
              <input value={yourProduct} onChange={(e) => setYourProduct(e.target.value)} placeholder="e.g. NovaTask Pro, CloudSync CRM"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">⚔️ Competitors *</label>
              <input value={competitors} onChange={(e) => setCompetitors(e.target.value)} placeholder="e.g. Asana, Monday.com, ClickUp, Notion"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">👥 Target Audience</label>
              <select value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                <option value="" className="bg-slate-800">Select audience...</option>
                <option value="Sales reps and SDRs" className="bg-slate-800">Sales reps and SDRs</option>
                <option value="Account executives" className="bg-slate-800">Account executives</option>
                <option value="Customer success managers" className="bg-slate-800">Customer success managers</option>
                <option value="All go-to-market teams" className="bg-slate-800">All go-to-market teams</option>
              </select>
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">📊 Deal Stage</label>
              <select value={dealStage} onChange={(e) => setDealStage(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                <option value="" className="bg-slate-800">All stages</option>
                <option value="Early-stage evaluation" className="bg-slate-800">Early-stage evaluation</option>
                <option value="Shortlist stage" className="bg-slate-800">Shortlist stage</option>
                <option value="Final evaluation" className="bg-slate-800">Final evaluation</option>
                <option value="Renewal (incumbent defense)" className="bg-slate-800">Renewal (incumbent defense)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-white font-semibold text-sm block mb-2">🏭 Product Category</label>
              <input value={productCategory} onChange={(e) => setProductCategory(e.target.value)} placeholder="e.g. SaaS project management, CRM, marketing automation, data analytics"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
          </div>

          <button onClick={generate} disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2">
            {loading ? <><span className="animate-spin text-xl">⚙️</span> Building battle cards...</> : <><span>⚔️</span> Generate Battle Cards</>}
          </button>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-5 py-3 text-red-300 text-sm">{error}</div>}

        {done && result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-orange-500/10 border-b border-orange-500/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚔️</span>
                <p className="text-orange-300 font-bold text-sm">Battle Cards: {yourProduct}</p>
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

        <p className="text-center text-xs text-slate-600">AI Competitive Battle Cards · {new Date().getFullYear()} · DeepSeek</p>
      </div>
    </main>
  );
}
