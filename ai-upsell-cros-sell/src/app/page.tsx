"use client";

import { useState } from "react";

function renderMarkdown(text: string) {
  return text.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-white mt-7 mb-3">{trimmed.replace("## ","")}</h2>;
    if (trimmed.startsWith("### ")) return <h3 key={i} className="text-base font-bold text-amber-300 mt-4 mb-2">{trimmed.replace("### ","")}</h3>;
    if (trimmed.startsWith("**")) return <p key={i} className="text-amber-200 font-semibold text-sm mt-2 mb-1">{trimmed.replace(/\*\*/g,"")}</p>;
    if (trimmed.startsWith("- ")) return <li key={i} className="text-slate-300 text-sm ml-4 mb-1 list-disc">{trimmed.replace("- ","")}</li>;
    if (/^\d+\.\s/.test(trimmed)) return <li key={i} className="text-slate-300 text-sm ml-4 mb-1">{trimmed}</li>;
    if (trimmed === "") return <div key={i} className="h-2" />;
    return <p key={i} className="text-slate-300 text-sm leading-relaxed mb-1">{trimmed}</p>;
  });
}

export default function Home() {
  const [currentProduct, setCurrentProduct] = useState("");
  const [customerProfile, setCustomerProfile] = useState("");
  const [purchaseHistory, setPurchaseHistory] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const generate = async () => {
    if (!currentProduct.trim()) { setError("Current product is required."); return; }
    setLoading(true);
    setError("");
    setResult("");
    setDone(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentProduct, customerProfile, purchaseHistory }),
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
          <span className="text-3xl">📈</span>
          <div>
            <h1 className="text-xl font-bold text-white">AI Upsell / Cross-Sell Generator</h1>
            <p className="text-xs text-slate-400">Revenue growth · Upgrade strategy · DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Grow Revenue with Smart Upsells & Cross-Sells 📈</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">Enter your product and customer → get upsell plans, cross-sell bundles, pricing anchors, and outreach templates.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div>
            <label className="text-white font-semibold text-sm block mb-2">🛍️ Current Product / Plan *</label>
            <input value={currentProduct} onChange={(e) => setCurrentProduct(e.target.value)} placeholder="e.g. NovaTask Starter ($19/mo), Pro Plan ($49/mo)"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div>
            <label className="text-white font-semibold text-sm block mb-2">👥 Customer Profile</label>
            <input value={customerProfile} onChange={(e) => setCustomerProfile(e.target.value)} placeholder="e.g. Startup teams (5-20 people), SaaS companies, freelancers"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div>
            <label className="text-white font-semibold text-sm block mb-2">📋 Purchase History / Customer Journey</label>
            <textarea value={purchaseHistory} onChange={(e) => setPurchaseHistory(e.target.value)} rows={3}
              placeholder="e.g. Customer signed up 6 months ago, uses core features daily, currently on Starter plan..."
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none" />
          </div>
          <button onClick={generate} disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2">
            {loading ? <><span className="animate-spin text-xl">⚙️</span> Analyzing opportunities...</> : <><span>📈</span> Generate Recommendations</>}
          </button>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-5 py-3 text-red-300 text-sm">{error}</div>}

        {done && result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-amber-500/10 border-b border-amber-500/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📈</span>
                <p className="text-amber-300 font-bold text-sm">Recommendations for: {currentProduct}</p>
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

        <p className="text-center text-xs text-slate-600">AI Upsell/Cross-Sell Generator · {new Date().getFullYear()} · DeepSeek</p>
      </div>
    </main>
  );
}
