"use client";

import { useState } from "react";

function renderMarkdown(text: string) {
  return text.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-white mt-7 mb-3 col-span-full">{trimmed.replace("## ","")}</h2>;
    if (trimmed.startsWith("### Chapter")) return <h3 key={i} className="text-base font-bold text-teal-300 mt-5 mb-2">{trimmed}</h3>;
    if (trimmed.startsWith("### ")) return <h3 key={i} className="text-sm font-bold text-amber-300 mt-4 mb-2">{trimmed.replace("### ","")}</h3>;
    if (trimmed.startsWith("**") && !trimmed.includes("\n")) return <p key={i} className="text-amber-200 font-semibold text-xs mt-2 mb-0.5">{trimmed.replace(/\*\*/g,"")}</p>;
    if (trimmed.startsWith("- ")) return <li key={i} className="text-slate-300 text-xs ml-4 mb-0.5 list-disc">{trimmed.replace("- ","")}</li>;
    if (/^\d+\.\s/.test(trimmed) && !trimmed.includes("|")) return <li key={i} className="text-slate-300 text-xs ml-4 mb-0.5">{trimmed}</li>;
    if (trimmed === "") return <div key={i} className="h-1.5" />;
    return <p key={i} className="text-slate-300 text-xs leading-relaxed mb-0.5">{trimmed}</p>;
  });
}

export default function Home() {
  const [topic, setTopic] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [whitepaperType, setWhitepaperType] = useState("");
  const [goal, setGoal] = useState("");
  const [length, setLength] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const generate = async () => {
    if (!topic.trim()) { setError("Topic is required."); return; }
    setLoading(true);
    setError("");
    setResult("");
    setDone(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, targetAudience, whitepaperType, goal, length, companyName }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Generation failed."); return; }
      setResult(data.result);
      setDone(true);
    } catch { setError("Failed to connect."); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950">
      <header className="border-b border-white/10 sticky top-0 z-10 bg-slate-950/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">📄</span>
          <div>
            <h1 className="text-xl font-bold text-white">AI Whitepaper Outline Generator</h1>
            <p className="text-xs text-slate-400">Thought leadership · B2B content · DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Build Authority with a Research-Grade Whitepaper 📄</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">Get a full whitepaper outline: chapter structure, research sources, title options, visual elements, and distribution plan.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="text-white font-semibold text-sm block mb-2">📋 Topic *</label>
              <textarea value={topic} onChange={(e) => setTopic(e.target.value)} rows={2}
                placeholder="e.g. The State of AI Adoption in Mid-Market SaaS, Why Remote-First Companies Outperform, The Future of B2B Sales in 2026..."
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">👥 Target Audience</label>
              <input value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="e.g. CTOs and engineering leaders, SMB founders"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">📝 Whitepaper Type</label>
              <select value={whitepaperType} onChange={(e) => setWhitepaperType(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
                <option value="" className="bg-slate-800">Select type...</option>
                <option value="Research findings (survey/data-driven)" className="bg-slate-800">Research findings (survey/data-driven)</option>
                <option value="How-to guide / technical tutorial" className="bg-slate-800">How-to guide / technical tutorial</option>
                <option value="Industry analysis / trend report" className="bg-slate-800">Industry analysis / trend report</option>
                <option value="Problem-solution (evaluating options)" className="bg-slate-800">Problem-solution (evaluating options)</option>
                <option value="Comparative analysis (vs competitors)" className="bg-slate-800">Comparative analysis (vs competitors)</option>
                <option value="Predictions / futures thinking" className="bg-slate-800">Predictions / futures thinking</option>
              </select>
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🎯 Goal</label>
              <select value={goal} onChange={(e) => setGoal(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
                <option value="" className="bg-slate-800">Select goal...</option>
                <option value="Lead generation (gated content)" className="bg-slate-800">Lead generation (gated content)</option>
                <option value="Thought leadership / brand authority" className="bg-slate-800">Thought leadership / brand authority</option>
                <option value="Sales enablement (support deal flow)" className="bg-slate-800">Sales enablement</option>
                <option value="PR / media coverage" className="bg-slate-800">PR / media coverage</option>
                <option value="Analyst relations" className="bg-slate-800">Analyst relations</option>
              </select>
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">📏 Desired Length</label>
              <select value={length} onChange={(e) => setLength(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
                <option value="" className="bg-slate-800">Select length...</option>
                <option value="1,500-2,500 words (short)" className="bg-slate-800">1,500-2,500 words (short)</option>
                <option value="3,000-5,000 words (standard)" className="bg-slate-800">3,000-5,000 words (standard)</option>
                <option value="5,000-8,000 words (long-form)" className="bg-slate-800">5,000-8,000 words (long-form)</option>
                <option value="8,000-15,000 words (comprehensive)" className="bg-slate-800">8,000-15,000 words (comprehensive)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-white font-semibold text-sm block mb-2">🏢 Company / Brand (optional)</label>
              <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. NovaTask, CloudStack, DataFlow — for context and positioning"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
          </div>

          <button onClick={generate} disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2">
            {loading ? <><span className="animate-spin text-xl">⚙️</span> Building outline...</> : <><span>📄</span> Generate Whitepaper Outline</>}
          </button>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-5 py-3 text-red-300 text-sm">{error}</div>}

        {done && result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-teal-500/10 border-b border-teal-500/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📄</span>
                <p className="text-teal-300 font-bold text-sm">Whitepaper Outline: {topic.slice(0, 50)}{topic.length > 50 ? "..." : ""}</p>
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

        <p className="text-center text-xs text-slate-600">AI Whitepaper Outline Generator · {new Date().getFullYear()} · DeepSeek</p>
      </div>
    </main>
  );
}
