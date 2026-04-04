"use client";

import { useState } from "react";

function renderEmail(text: string) {
  return text.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) return <h2 key={i} className="text-lg font-bold text-white mt-6 mb-3">{trimmed.replace("## ","")}</h2>;
    if (trimmed.startsWith("### Email")) return <h3 key={i} className="text-base font-bold text-amber-300 mt-4 mb-2">{trimmed}</h3>;
    if (trimmed.startsWith("### ")) return <h3 key={i} className="text-sm font-bold text-emerald-300 mt-3 mb-1">{trimmed.replace("### ","")}</h3>;
    if (trimmed.startsWith("**") && trimmed.endsWith("**")) return <p key={i} className="text-amber-200 font-semibold text-xs mt-2 mb-0.5">{trimmed.replace(/\*\*/g,"")}</p>;
    if (trimmed.startsWith("- ")) return <li key={i} className="text-slate-300 text-xs ml-4 mb-0.5 list-disc">{trimmed.replace("- ","")}</li>;
    if (/^\d+\.\s/.test(trimmed)) return <li key={i} className="text-slate-300 text-xs ml-4 mb-0.5">{trimmed}</li>;
    if (trimmed === "") return <div key={i} className="h-1.5" />;
    return <p key={i} className="text-slate-300 text-xs leading-relaxed mb-0.5">{trimmed}</p>;
  });
}

export default function Home() {
  const [productName, setProductName] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [npsScore, setNpsScore] = useState("");
  const [painPoint, setPainPoint] = useState("");
  const [tone, setTone] = useState("Warm, empathetic, conversational");
  const [language, setLanguage] = useState("English");
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
        body: JSON.stringify({ productName, customerType, npsScore, painPoint, tone, language }),
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
          <span className="text-3xl">📊</span>
          <div>
            <h1 className="text-xl font-bold text-white">AI NPS Follow-up Email Generator</h1>
            <p className="text-xs text-slate-400">Customer success · Detractor/Passive/Promoter sequences · DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Turn NPS Responses Into Action 📊</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">Generate personalized follow-up email sequences for Detractors (0-6), Passives (7-8), and Promoters (9-10).</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🏷️ Product / Service Name *</label>
              <input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g. NovaTask Pro, CloudSync, DataPilot"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">👥 Customer Type</label>
              <input value={customerType} onChange={(e) => setCustomerType(e.target.value)} placeholder="e.g. Enterprise SaaS, SMB, freelancers, e-commerce"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">📈 NPS Score Target</label>
              <select value={npsScore} onChange={(e) => setNpsScore(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-400">
                <option value="" className="bg-slate-800">All segments (0-10)</option>
                <option value="Detractor (0-6)" className="bg-slate-800">Detractor (0-6)</option>
                <option value="Passive (7-8)" className="bg-slate-800">Passive (7-8)</option>
                <option value="Promoter (9-10)" className="bg-slate-800">Promoter (9-10)</option>
              </select>
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🗣️ Tone</label>
              <select value={tone} onChange={(e) => setTone(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-400">
                <option value="Warm, empathetic, conversational" className="bg-slate-800">Warm, empathetic, conversational</option>
                <option value="Formal, professional" className="bg-slate-800">Formal, professional</option>
                <option value="Casual, friendly" className="bg-slate-800">Casual, friendly</option>
                <option value="Direct, to-the-point" className="bg-slate-800">Direct, to-the-point</option>
              </select>
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">😣 Primary Pain Point</label>
              <input value={painPoint} onChange={(e) => setPainPoint(e.target.value)} placeholder="e.g. Feature gaps, pricing, poor support, usability"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🌐 Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-400">
                <option value="English" className="bg-slate-800">English</option>
                <option value="Spanish" className="bg-slate-800">Spanish</option>
                <option value="French" className="bg-slate-800">French</option>
                <option value="German" className="bg-slate-800">German</option>
                <option value="Portuguese" className="bg-slate-800">Portuguese</option>
                <option value="Japanese" className="bg-slate-800">Japanese</option>
              </select>
            </div>
          </div>

          <button onClick={generate} disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2">
            {loading ? <><span className="animate-spin text-xl">⚙️</span> Crafting sequences...</> : <><span>📊</span> Generate NPS Email Sequences</>}
          </button>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-5 py-3 text-red-300 text-sm">{error}</div>}

        {done && result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-rose-500/10 border-b border-rose-500/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📊</span>
                <p className="text-rose-300 font-bold text-sm">NPS Sequences for: {productName}</p>
              </div>
              <button onClick={() => navigator.clipboard?.writeText(result)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-xs border border-white/10 transition-all">
                📋 Copy All
              </button>
            </div>
            <div className="px-6 py-5">
              {renderEmail(result)}
            </div>
          </div>
        )}

        <p className="text-center text-xs text-slate-600">AI NPS Follow-up Email Generator · {new Date().getFullYear()} · DeepSeek</p>
      </div>
    </main>
  );
}
