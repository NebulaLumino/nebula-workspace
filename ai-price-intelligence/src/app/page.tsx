"use client";

import { useState } from "react";

function renderMarkdown(text: string) {
  return text.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-white mt-7 mb-3 col-span-full">{trimmed.replace("## ","")}</h2>;
    if (trimmed.startsWith("### ")) return <h3 key={i} className="text-sm font-bold text-cyan-300 mt-4 mb-2">{trimmed.replace("### ","")}</h3>;
    if (trimmed.startsWith("**") && !trimmed.includes("\n")) return <p key={i} className="text-amber-200 font-semibold text-xs mt-2 mb-0.5">{trimmed.replace(/\*\*/g,"")}</p>;
    if (trimmed.startsWith("- ")) return <li key={i} className="text-slate-300 text-xs ml-4 mb-0.5 list-disc">{trimmed.replace("- ","")}</li>;
    if (/^\d+\.\s/.test(trimmed)) return <li key={i} className="text-slate-300 text-xs ml-4 mb-0.5">{trimmed}</li>;
    if (trimmed.startsWith("|")) {
      const cells = trimmed.split("|").filter(c => c.trim() && c.trim() !== "---");
      if (cells.length > 1) {
        return (
          <div key={i} className="overflow-x-auto mb-1">
            <div className="flex gap-1 min-w-max">
              {cells.map((cell, ci) => (
                <span key={ci} className={`text-xs px-2 py-1 rounded whitespace-nowrap ${ci === 0 ? "bg-cyan-500/20 text-cyan-200 font-semibold" : "bg-white/5 text-slate-300"}`}>{cell.trim()}</span>
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
  const [marketPosition, setMarketPosition] = useState("");
  const [pricingModel, setPricingModel] = useState("");
  const [targetCustomer, setTargetCustomer] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const generate = async () => {
    if (!yourProduct.trim()) { setError("Your product is required."); return; }
    setLoading(true);
    setError("");
    setResult("");
    setDone(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ yourProduct, competitors, marketPosition, pricingModel, targetCustomer }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Generation failed."); return; }
      setResult(data.result);
      setDone(true);
    } catch { setError("Failed to connect."); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950">
      <header className="border-b border-white/10 sticky top-0 z-10 bg-slate-950/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">💰</span>
          <div>
            <h1 className="text-xl font-bold text-white">AI Competitor Price Intelligence</h1>
            <p className="text-xs text-slate-400">Pricing strategy · Competitive analysis · DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Know Your Market&apos;s Pricing. Set Smarter Prices. 💰</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">Get a full competitor pricing analysis, positioning matrix, and actionable pricing recommendations.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🏷️ Your Product *</label>
              <input value={yourProduct} onChange={(e) => setYourProduct(e.target.value)} placeholder="e.g. NovaTask Pro, DataSync CRM, CloudStack Analytics"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🏴 Competitors</label>
              <input value={competitors} onChange={(e) => setCompetitors(e.target.value)} placeholder="e.g. Asana, Monday.com, ClickUp, Notion"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🎯 Market Position</label>
              <input value={marketPosition} onChange={(e) => setMarketPosition(e.target.value)} placeholder="e.g. Mid-market SaaS, differentiating on UX and integrations"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">💳 Your Pricing Model</label>
              <select value={pricingModel} onChange={(e) => setPricingModel(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400">
                <option value="" className="bg-slate-800">Select model...</option>
                <option value="Subscription - per user / per seat" className="bg-slate-800">Per user / per seat</option>
                <option value="Subscription - flat rate per team" className="bg-slate-800">Flat rate per team</option>
                <option value="Usage-based (per API call, per GB)" className="bg-slate-800">Usage-based</option>
                <option value="Freemium + paid upgrade" className="bg-slate-800">Freemium + upgrade</option>
                <option value="Tiered - Starter, Pro, Enterprise" className="bg-slate-800">Tiered (Starter/Pro/Enterprise)</option>
                <option value="Flat rate + add-ons" className="bg-slate-800">Flat rate + add-ons</option>
                <option value="Hybrid (subscription + usage)" className="bg-slate-800">Hybrid</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-white font-semibold text-sm block mb-2">👥 Target Customer</label>
              <input value={targetCustomer} onChange={(e) => setTargetCustomer(e.target.value)} placeholder="e.g. SMB to mid-market, 10-500 employees, $50K-$5M revenue"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
            </div>
          </div>

          <button onClick={generate} disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2">
            {loading ? <><span className="animate-spin text-xl">⚙️</span> Analyzing markets...</> : <><span>💰</span> Generate Price Intelligence Report</>}
          </button>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-5 py-3 text-red-300 text-sm">{error}</div>}

        {done && result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-cyan-500/10 border-b border-cyan-500/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💰</span>
                <p className="text-cyan-300 font-bold text-sm">Price Intelligence: {yourProduct}</p>
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

        <p className="text-center text-xs text-slate-600">AI Competitor Price Intelligence · {new Date().getFullYear()} · DeepSeek</p>
      </div>
    </main>
  );
}
