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
    if (trimmed === "") return <div key={i} className="h-1.5" />;
    return <p key={i} className="text-slate-300 text-xs leading-relaxed mb-0.5">{trimmed}</p>;
  });
}

export default function Home() {
  const [name, setName] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [careerGoals, setCareerGoals] = useState("");
  const [platforms, setPlatforms] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const generate = async () => {
    if (!name.trim()) { setError("Your name is required."); return; }
    setLoading(true);
    setError("");
    setResult("");
    setDone(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, currentRole, industry, targetAudience, careerGoals, platforms }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Generation failed."); return; }
      setResult(data.result);
      setDone(true);
    } catch { setError("Failed to connect."); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-fuchsia-950">
      <header className="border-b border-white/10 sticky top-0 z-10 bg-slate-950/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">✨</span>
          <div>
            <h1 className="text-xl font-bold text-white">AI Personal Brand Generator</h1>
            <p className="text-xs text-slate-400">Career positioning · LinkedIn · Thought leadership · DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Build a Personal Brand That Stands Out ✨</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">Generate your complete personal brand: statement, LinkedIn headline, about section, Twitter bio, content pillars, and visibility strategy.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-white font-semibold text-sm block mb-2">👤 Your Name *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Alex Rivera, Jordan Kim"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">💼 Current Role</label>
              <input value={currentRole} onChange={(e) => setCurrentRole(e.target.value)} placeholder="e.g. Senior Product Manager at NovaTask"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🏭 Industry</label>
              <input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. Technology, SaaS, FinTech, Healthcare"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🎯 Target Audience</label>
              <input value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="e.g. Recruiters, peers, industry leaders"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🚀 Career Goals</label>
              <select value={careerGoals} onChange={(e) => setCareerGoals(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-400">
                <option value="" className="bg-slate-800">Select goal...</option>
                <option value="Thought leadership" className="bg-slate-800">Thought leadership</option>
                <option value="Executive leadership role" className="bg-slate-800">Executive leadership role</option>
                <option value="Speaking engagements" className="bg-slate-800">Speaking engagements</option>
                <option value="Advisory / board positions" className="bg-slate-800">Advisory / board positions</option>
                <option value="Career transition" className="bg-slate-800">Career transition</option>
                <option value="Build a following / influence" className="bg-slate-800">Build a following / influence</option>
              </select>
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">📱 Active Platforms</label>
              <input value={platforms} onChange={(e) => setPlatforms(e.target.value)} placeholder="e.g. LinkedIn, Twitter/X, Instagram"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-400" />
            </div>
          </div>

          <button onClick={generate} disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2">
            {loading ? <><span className="animate-spin text-xl">⚙️</span> Building your brand...</> : <><span>✨</span> Generate Personal Brand</>}
          </button>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-5 py-3 text-red-300 text-sm">{error}</div>}

        {done && result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-fuchsia-500/10 border-b border-fuchsia-500/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✨</span>
                <p className="text-fuchsia-300 font-bold text-sm">Personal Brand: {name}</p>
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

        <p className="text-center text-xs text-slate-600">AI Personal Brand Generator · {new Date().getFullYear()} · DeepSeek</p>
      </div>
    </main>
  );
}
