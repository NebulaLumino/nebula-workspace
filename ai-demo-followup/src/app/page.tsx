"use client";

import { useState } from "react";

function renderMarkdown(text: string) {
  return text.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-white mt-7 mb-3 col-span-full">{trimmed.replace("## ","")}</h2>;
    if (trimmed.startsWith("### Script")) return <h3 key={i} className="text-sm font-bold text-blue-300 mt-4 mb-2">{trimmed}</h3>;
    if (trimmed.startsWith("### ")) return <h3 key={i} className="text-sm font-bold text-amber-300 mt-4 mb-2">{trimmed}</h3>;
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
                <span key={ci} className={`text-xs px-2 py-1 rounded whitespace-nowrap ${ci === 0 ? "bg-blue-500/20 text-blue-200 font-semibold" : "bg-white/5 text-slate-300"}`}>{cell.trim()}</span>
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
  const [targetAudience, setTargetAudience] = useState("");
  const [demoType, setDemoType] = useState("");
  const [salesTeamSize, setSalesTeamSize] = useState("");
  const [followUpMedium, setFollowUpMedium] = useState("Email + phone");
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
        body: JSON.stringify({ productName, targetAudience, demoType, salesTeamSize, followUpMedium }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Generation failed."); return; }
      setResult(data.result);
      setDone(true);
    } catch { setError("Failed to connect."); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
      <header className="border-b border-white/10 sticky top-0 z-10 bg-slate-950/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">📞</span>
          <div>
            <h1 className="text-xl font-bold text-white">AI Demo Follow-Up Sequence Generator</h1>
            <p className="text-xs text-slate-400">Sales · Demo-to-close · Email + phone + SMS · DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Stop Letting Demo Requests Go Cold 📞</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">Generate a complete multi-channel follow-up sequence: emails, voicemails, LinkedIn, SMS, and demo-to-close playbook.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🏷️ Product Name *</label>
              <input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g. NovaTask Pro, CloudSync, DataFlow Analytics"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">👥 Target Audience</label>
              <input value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="e.g. VP of Operations, SaaS founders, marketing teams"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🎯 Demo Type</label>
              <select value={demoType} onChange={(e) => setDemoType(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="" className="bg-slate-800">Select demo type...</option>
                <option value="Live product demo (30-60 min)" className="bg-slate-800">Live product demo (30-60 min)</option>
                <option value="Recorded demo (5-15 min)" className="bg-slate-800">Recorded demo (5-15 min)</option>
                <option value="Interactive sandbox / free trial" className="bg-slate-800">Interactive sandbox / free trial</option>
                <option value="Pilot / proof of concept (PoC)" className="bg-slate-800">Pilot / PoC</option>
                <option value="Executive briefing (15-30 min)" className="bg-slate-800">Executive briefing (15-30 min)</option>
              </select>
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">👔 Sales Team Size</label>
              <select value={salesTeamSize} onChange={(e) => setSalesTeamSize(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="" className="bg-slate-800">Select team size...</option>
                <option value="Solo founder doing sales" className="bg-slate-800">Solo founder doing sales</option>
                <option value="Small team (1-3 SDRs/AEs)" className="bg-slate-800">Small team (1-3 SDRs/AEs)</option>
                <option value="Mid-size team (4-10)" className="bg-slate-800">Mid-size team (4-10)</option>
                <option value="Large sales team (10+)" className="bg-slate-800">Large sales team (10+)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-white font-semibold text-sm block mb-2">📡 Follow-Up Channels</label>
              <select value={followUpMedium} onChange={(e) => setFollowUpMedium(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="Email + phone" className="bg-slate-800">Email + phone (recommended)</option>
                <option value="Email only" className="bg-slate-800">Email only</option>
                <option value="LinkedIn + email" className="bg-slate-800">LinkedIn + email</option>
                <option value="SMS + email" className="bg-slate-800">SMS + email</option>
                <option value="All channels (email + phone + LinkedIn + SMS)" className="bg-slate-800">All channels</option>
              </select>
            </div>
          </div>

          <button onClick={generate} disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2">
            {loading ? <><span className="animate-spin text-xl">⚙️</span> Building sequences...</> : <><span>📞</span> Generate Demo Follow-Up Sequence</>}
          </button>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-5 py-3 text-red-300 text-sm">{error}</div>}

        {done && result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-blue-500/10 border-b border-blue-500/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📞</span>
                <p className="text-blue-300 font-bold text-sm">Demo Follow-Up: {productName}</p>
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

        <p className="text-center text-xs text-slate-600">AI Demo Follow-Up Sequence Generator · {new Date().getFullYear()} · DeepSeek</p>
      </div>
    </main>
  );
}
