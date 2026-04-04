"use client";

import { useState } from "react";

function renderMarkdown(text: string) {
  return text.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-white mt-7 mb-3 col-span-full">{trimmed.replace("## ","")}</h2>;
    if (trimmed.startsWith("### ")) return <h3 key={i} className="text-sm font-bold text-amber-300 mt-4 mb-2">{trimmed.replace("### ","")}</h3>;
    if (trimmed.startsWith("**")) return <p key={i} className="text-amber-200 font-semibold text-xs mt-2 mb-0.5">{trimmed.replace(/\*\*/g,"")}</p>;
    if (trimmed.startsWith("- ")) return <li key={i} className="text-slate-300 text-xs ml-4 mb-0.5 list-disc">{trimmed.replace("- ","")}</li>;
    if (/^\d+\.\s/.test(trimmed)) return <li key={i} className="text-slate-300 text-xs ml-4 mb-0.5">{trimmed}</li>;
    if (trimmed === "") return <div key={i} className="h-1.5" />;
    return <p key={i} className="text-slate-300 text-xs leading-relaxed mb-0.5">{trimmed}</p>;
  });
}

export default function Home() {
  const [repoName, setRepoName] = useState("");
  const [language, setLanguage] = useState("");
  const [prDescription, setPrDescription] = useState("");
  const [reviewComments, setReviewComments] = useState("");
  const [focusAreas, setFocusAreas] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const generate = async () => {
    if (!repoName.trim()) { setError("Repository name is required."); return; }
    setLoading(true);
    setError("");
    setResult("");
    setDone(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoName, language, prDescription, reviewComments, focusAreas }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Generation failed."); return; }
      setResult(data.result);
      setDone(true);
    } catch { setError("Failed to connect."); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950">
      <header className="border-b border-white/10 sticky top-0 z-10 bg-slate-950/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">🔍</span>
          <div>
            <h1 className="text-xl font-bold text-white">AI Code Review Summary</h1>
            <p className="text-xs text-slate-400">Engineering · Pull requests · DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Turn Code Review Chaos into Actionable Feedback 🔍</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">Paste review comments, get a structured summary: critical issues, security assessment, testing gaps, and a clear reviewer decision.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-white font-semibold text-sm block mb-2">📦 Repository Name *</label>
              <input value={repoName} onChange={(e) => setRepoName(e.target.value)} placeholder="e.g. frontend-app, payments-service, data-pipeline"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-zinc-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">💻 Language / Stack</label>
              <input value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="e.g. TypeScript + React, Python, Go"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-zinc-400" />
            </div>
            <div className="md:col-span-2">
              <label className="text-white font-semibold text-sm block mb-2">📝 PR Description</label>
              <textarea value={prDescription} onChange={(e) => setPrDescription(e.target.value)} rows={2}
                placeholder="e.g. Adds user authentication flow with OAuth 2.0 + JWT refresh tokens..."
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 resize-none" />
            </div>
            <div className="md:col-span-2">
              <label className="text-white font-semibold text-sm block mb-2">💬 Review Comments * (paste review feedback)</label>
              <textarea value={reviewComments} onChange={(e) => setReviewComments(e.target.value)} rows={8}
                placeholder="Paste code review comments here — one comment per line or as a block...&#10;&#10;e.g.&#10;'This function is 200 lines long — consider splitting it up'&#10;'Missing null check on user object on line 42'&#10;'N+1 query: this loop fetches users one by one'&#10;'Good use of memo here 👍'"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 resize-y font-mono" />
            </div>
            <div className="md:col-span-2">
              <label className="text-white font-semibold text-sm block mb-2">🎯 Focus Areas</label>
              <input value={focusAreas} onChange={(e) => setFocusAreas(e.target.value)} placeholder="e.g. Security, performance, maintainability, test coverage"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-zinc-400" />
            </div>
          </div>

          <button onClick={generate} disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-zinc-600 to-slate-600 hover:from-zinc-500 hover:to-slate-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2">
            {loading ? <><span className="animate-spin text-xl">⚙️</span> Reviewing code...</> : <><span>🔍</span> Generate Review Summary</>}
          </button>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-5 py-3 text-red-300 text-sm">{error}</div>}

        {done && result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-zinc-500/10 border-b border-zinc-500/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔍</span>
                <p className="text-zinc-300 font-bold text-sm">Code Review: {repoName}</p>
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

        <p className="text-center text-xs text-slate-600">AI Code Review Summary · {new Date().getFullYear()} · DeepSeek</p>
      </div>
    </main>
  );
}
