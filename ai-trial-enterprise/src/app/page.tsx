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
    if (trimmed.startsWith("|")) {
      const cells = trimmed.split("|").filter(c => c.trim() && c.trim() !== "---");
      if (cells.length > 1) {
        return (
          <div key={i} className="overflow-x-auto mb-1">
            <div className="flex gap-1 min-w-max">
              {cells.map((cell, ci) => (
                <span key={ci} className={`text-xs px-2 py-1 rounded whitespace-nowrap ${ci === 0 ? "bg-amber-500/20 text-amber-200 font-semibold" : "bg-white/5 text-slate-300"}`}>{cell.trim()}</span>
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
  const [productName, setProductName] = useState("");
  const [trialLength, setTrialLength] = useState("");
  const [currentPricing, setCurrentPricing] = useState("");
  const [targetSegments, setTargetSegments] = useState("");
  const [conversionRate, setConversionRate] = useState("");
  const [avgDealSize, setAvgDealSize] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const generate = async () => {
    if (!productName.trim()) { setError("Product name is required."); return; }
    setLoading(true);
    setError("");
    setResult("");
    setDone(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, trialLength, currentPricing, targetSegments, conversionRate, avgDealSize }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Generation failed."); return; }
      setResult(data.result);
      setDone(true);
    } catch { setError("Failed to connect."); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950">
      <header className="border-b border-white/10 sticky top-0 z-10 bg-slate-950/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">🚀</span>
          <div>
            <h1 className="text-xl font-bold text-white">AI Trial → Enterprise Upgrade Calculator</h1>
            <p className="text-xs text-slate-400">Conversion strategy · Expansion revenue · DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Turn Trials into Enterprise Deals 🚀</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">Get a full upgrade funnel analysis, revenue impact model, enterprise pricing calculator, and conversion playbook.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🏷️ Product Name *</label>
              <input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g. NovaTask Pro, CloudSync, DataFlow"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">📅 Trial Length</label>
              <select value={trialLength} onChange={(e) => setTrialLength(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
                <option value="" className="bg-slate-800">Select trial length...</option>
                <option value="7 days" className="bg-slate-800">7 days</option>
                <option value="14 days" className="bg-slate-800">14 days</option>
                <option value="30 days" className="bg-slate-800">30 days</option>
                <option value="Freemium (no time limit)" className="bg-slate-800">Freemium (no limit)</option>
              </select>
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">💳 Current Pricing Tiers</label>
              <input value={currentPricing} onChange={(e) => setCurrentPricing(e.target.value)} placeholder="e.g. Starter $29/mo, Pro $79/mo, Enterprise custom"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🎯 Target Customer Segments</label>
              <input value={targetSegments} onChange={(e) => setTargetSegments(e.target.value)} placeholder="e.g. SMB (5-50), Mid-Market (50-500), Enterprise (500+)"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">📈 Trial-to-Paid Conversion Rate</label>
              <select value={conversionRate} onChange={(e) => setConversionRate(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
                <option value="" className="bg-slate-800">Select current rate...</option>
                <option value="<5% (below average)" className="bg-slate-800">&lt;5% (below average)</option>
                <option value="5-10% (average)" className="bg-slate-800">5-10% (average)</option>
                <option value="10-15% (typical SaaS)" className="bg-slate-800">10-15% (typical SaaS)</option>
                <option value="15-25% (good)" className="bg-slate-800">15-25% (good)</option>
                <option value="25%+ (best-in-class)" className="bg-slate-800">25%+ (best-in-class)</option>
              </select>
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">💰 Average Deal Size (MRR)</label>
              <input value={avgDealSize} onChange={(e) => setAvgDealSize(e.target.value)} placeholder="e.g. $79 MRR, $500 MRR, $5K MRR"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
          </div>

          <button onClick={generate} disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2">
            {loading ? <><span className="animate-spin text-xl">⚙️</span> Calculating upgrades...</> : <><span>🚀</span> Calculate Upgrade Strategy</>}
          </button>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-5 py-3 text-red-300 text-sm">{error}</div>}

        {done && result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-amber-500/10 border-b border-amber-500/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚀</span>
                <p className="text-amber-300 font-bold text-sm">Upgrade Strategy: {productName}</p>
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

        <p className="text-center text-xs text-slate-600">AI Trial → Enterprise Upgrade Calculator · {new Date().getFullYear()} · DeepSeek</p>
      </div>
    </main>
  );
}
