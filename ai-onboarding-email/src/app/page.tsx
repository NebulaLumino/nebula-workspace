"use client";

import { useState } from "react";

function renderMarkdown(text: string) {
  return text.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-white mt-7 mb-3 col-span-full">{trimmed.replace("## ","")}</h2>;
    if (trimmed.startsWith("### Email")) return <h3 key={i} className="text-base font-bold text-indigo-300 mt-5 mb-2">{trimmed}</h3>;
    if (trimmed.startsWith("### ")) return <h3 key={i} className="text-sm font-bold text-amber-300 mt-4 mb-2">{trimmed.replace("### ","")}</h3>;
    if (trimmed.startsWith("**") && !trimmed.includes("\n")) return <p key={i} className="text-amber-200 font-semibold text-xs mt-2 mb-0.5">{trimmed.replace(/\*\*/g,"")}</p>;
    if (trimmed.startsWith("- ")) return <li key={i} className="text-slate-300 text-xs ml-4 mb-0.5 list-disc">{trimmed.replace("- ","")}</li>;
    if (/^\d+\.\s/.test(trimmed) && !trimmed.includes("|")) return <li key={i} className="text-slate-300 text-xs ml-4 mb-0.5">{trimmed}</li>;
    if (trimmed === "") return <div key={i} className="h-1.5" />;
    return <p key={i} className="text-slate-300 text-xs leading-relaxed mb-0.5">{trimmed}</p>;
  });
}

export default function Home() {
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [trialLength, setTrialLength] = useState("14-day free trial");
  const [onboardingGoal, setOnboardingGoal] = useState("");
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
        body: JSON.stringify({ productName, productType, targetAudience, trialLength, onboardingGoal }),
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
          <span className="text-3xl">🚀</span>
          <div>
            <h1 className="text-xl font-bold text-white">AI Onboarding Email Sequence</h1>
            <p className="text-xs text-slate-400">Customer activation · Trial conversion · DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Turn New Signups Into Loyal Users 🚀</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">Generate a complete onboarding email sequence: Day 1-14, welcome emails, activation sequences, and trial conversion.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🏷️ Product Name *</label>
              <input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g. NovaTask Pro, CloudSync, DataFlow"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">📦 Product Type</label>
              <select value={productType} onChange={(e) => setProductType(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                <option value="" className="bg-slate-800">Select type...</option>
                <option value="SaaS software (B2B)" className="bg-slate-800">SaaS software (B2B)</option>
                <option value="SaaS software (B2C)" className="bg-slate-800">SaaS software (B2C)</option>
                <option value="Digital tool / productivity app" className="bg-slate-800">Digital tool / productivity app</option>
                <option value="E-commerce / online platform" className="bg-slate-800">E-commerce / online platform</option>
                <option value="Online course / membership" className="bg-slate-800">Online course / membership</option>
                <option value="Developer tool / API" className="bg-slate-800">Developer tool / API</option>
              </select>
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">👥 Target Audience</label>
              <input value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="e.g. Startup founders, marketing teams, developers"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">📅 Trial Length</label>
              <select value={trialLength} onChange={(e) => setTrialLength(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                <option value="14-day free trial" className="bg-slate-800">14-day free trial</option>
                <option value="7-day free trial" className="bg-slate-800">7-day free trial</option>
                <option value="30-day free trial" className="bg-slate-800">30-day free trial</option>
                <option value="Freemium (no time limit)" className="bg-slate-800">Freemium (no time limit)</option>
                <option value="Paid only (no trial)" className="bg-slate-800">Paid only (no trial)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-white font-semibold text-sm block mb-2">🎯 Primary Onboarding Goal</label>
              <select value={onboardingGoal} onChange={(e) => setOnboardingGoal(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                <option value="" className="bg-slate-800">Select goal...</option>
                <option value="Activate users, reduce time-to-value" className="bg-slate-800">Activate users, reduce time-to-value</option>
                <option value="Convert trial users to paid" className="bg-slate-800">Convert trial users to paid</option>
                <option value="Reduce churn in first 30 days" className="bg-slate-800">Reduce churn in first 30 days</option>
                <option value="Get users to complete key action" className="bg-slate-800">Get users to complete key action</option>
                <option value="Drive product adoption across team" className="bg-slate-800">Drive product adoption across team</option>
              </select>
            </div>
          </div>

          <button onClick={generate} disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2">
            {loading ? <><span className="animate-spin text-xl">⚙️</span> Building sequence...</> : <><span>🚀</span> Generate Onboarding Sequence</>}
          </button>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-5 py-3 text-red-300 text-sm">{error}</div>}

        {done && result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-indigo-500/10 border-b border-indigo-500/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚀</span>
                <p className="text-indigo-300 font-bold text-sm">Onboarding Sequence: {productName}</p>
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

        <p className="text-center text-xs text-slate-600">AI Onboarding Email Sequence Generator · {new Date().getFullYear()} · DeepSeek</p>
      </div>
    </main>
  );
}
