"use client";

import { useState } from "react";

function renderMarkdown(text: string) {
  return text.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-white mt-7 mb-3 col-span-full">{trimmed.replace("## ","")}</h2>;
    if (trimmed.startsWith("### ")) return <h3 key={i} className="text-sm font-bold text-teal-300 mt-4 mb-2">{trimmed.replace("### ","")}</h3>;
    if (trimmed.startsWith("**") && trimmed.endsWith("**") && !trimmed.includes("\n")) return <p key={i} className="text-amber-200 font-semibold text-xs mt-2 mb-0.5">{trimmed.replace(/\*\*/g,"")}</p>;
    if (trimmed.startsWith("- ")) return <li key={i} className="text-slate-300 text-xs ml-4 mb-0.5 list-disc">{trimmed.replace("- ","")}</li>;
    if (/^\d+\.\s/.test(trimmed)) return <li key={i} className="text-slate-300 text-xs ml-4 mb-0.5">{trimmed}</li>;
    if (trimmed.startsWith("|")) {
      const cells = trimmed.split("|").filter(c => c.trim() && c.trim() !== "---");
      if (cells.length > 0) {
        return (
          <div key={i} className="grid gap-1 mb-1" style={{ gridTemplateColumns: `repeat(${Math.min(cells.length, 5)}, 1fr)` }}>
            {cells.map((cell, ci) => (
              <span key={ci} className="text-slate-300 text-xs bg-white/5 px-2 py-1 rounded">{cell.trim()}</span>
            ))}
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
  const [surveyType, setSurveyType] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [goals, setGoals] = useState("");
  const [questionCount, setQuestionCount] = useState("");
  const [format, setFormat] = useState("Mixed (multiple choice + open-ended + rating)");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const generate = async () => {
    if (!surveyType.trim()) { setError("Survey type is required."); return; }
    setLoading(true);
    setError("");
    setResult("");
    setDone(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ surveyType, targetAudience, goals, questionCount, format }),
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
          <span className="text-3xl">📋</span>
          <div>
            <h1 className="text-xl font-bold text-white">AI Survey Question Generator</h1>
            <p className="text-xs text-slate-400">UX research · Question bank · DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Build Research-Grade Surveys in Seconds 📋</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">Enter your survey goals and audience → get structured questions with types, answer options, and analysis tips.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-white font-semibold text-sm block mb-2">📋 Survey Type *</label>
              <select value={surveyType} onChange={(e) => setSurveyType(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
                <option value="" className="bg-slate-800">Select survey type...</option>
                <option value="Customer Satisfaction (CSAT)" className="bg-slate-800">Customer Satisfaction (CSAT)</option>
                <option value="Net Promoter Score (NPS)" className="bg-slate-800">Net Promoter Score (NPS)</option>
                <option value="Product Market Fit" className="bg-slate-800">Product Market Fit</option>
                <option value="Employee Engagement" className="bg-slate-800">Employee Engagement</option>
                <option value="User Experience (UX) Feedback" className="bg-slate-800">User Experience (UX) Feedback</option>
                <option value="Feature Prioritization" className="bg-slate-800">Feature Prioritization</option>
                <option value="Brand Awareness" className="bg-slate-800">Brand Awareness</option>
                <option value="Pricing Sensitivity" className="bg-slate-800">Pricing Sensitivity</option>
                <option value="Customer Churn Interview" className="bg-slate-800">Customer Churn Interview</option>
                <option value="Event / Conference Feedback" className="bg-slate-800">Event / Conference Feedback</option>
              </select>
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">👥 Target Audience</label>
              <input value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="e.g. SaaS power users, Gen Z consumers, enterprise buyers"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🎯 Primary Goals</label>
              <input value={goals} onChange={(e) => setGoals(e.target.value)} placeholder="e.g. Measure NPS, find churn drivers, prioritize roadmap"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🔢 Number of Questions</label>
              <select value={questionCount} onChange={(e) => setQuestionCount(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
                <option value="" className="bg-slate-800">Recommended (15-25)</option>
                <option value="5-8" className="bg-slate-800">Quick pulse (5-8)</option>
                <option value="10-15" className="bg-slate-800">Short (10-15)</option>
                <option value="25-35" className="bg-slate-800">Comprehensive (25-35)</option>
                <option value="50+" className="bg-slate-800">Deep dive (50+)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-white font-semibold text-sm block mb-2">📝 Question Format</label>
              <select value={format} onChange={(e) => setFormat(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
                <option value="Mixed (multiple choice + open-ended + rating)" className="bg-slate-800">Mixed (multiple choice + open-ended + rating)</option>
                <option value="Mostly multiple choice" className="bg-slate-800">Mostly multiple choice</option>
                <option value="Mostly open-ended" className="bg-slate-800">Mostly open-ended</option>
                <option value="Rating scales only (1-5, 1-10)" className="bg-slate-800">Rating scales only</option>
                <option value="Yes/No + Multiple choice" className="bg-slate-800">Yes/No + Multiple choice</option>
              </select>
            </div>
          </div>

          <button onClick={generate} disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2">
            {loading ? <><span className="animate-spin text-xl">⚙️</span> Building survey...</> : <><span>📋</span> Generate Survey Questions</>}
          </button>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-5 py-3 text-red-300 text-sm">{error}</div>}

        {done && result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-teal-500/10 border-b border-teal-500/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📋</span>
                <p className="text-teal-300 font-bold text-sm">Survey Questions for: {surveyType}</p>
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

        <p className="text-center text-xs text-slate-600">AI Survey Question Generator · {new Date().getFullYear()} · DeepSeek</p>
      </div>
    </main>
  );
}
