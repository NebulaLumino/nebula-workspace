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
  const [teamType, setTeamType] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [surveyGoal, setSurveyGoal] = useState("");
  const [anonymity, setAnonymity] = useState("");
  const [frequency, setFrequency] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const generate = async () => {
    if (!teamType.trim()) { setError("Team type is required."); return; }
    setLoading(true); setError(""); setResult(""); setDone(false);
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamType, teamSize, surveyGoal, anonymity, frequency }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Generation failed."); return; }
      setResult(data.result); setDone(true);
    } catch { setError("Failed to connect."); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950">
      <header className="border-b border-white/10 sticky top-0 z-10 bg-slate-950/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">📋</span>
          <div>
            <h1 className="text-xl font-bold text-white">AI Team Feedback Survey</h1>
            <p className="text-xs text-slate-400">People ops · Engagement · DeepSeek</p>
          </div>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Build Surveys Your Team Will Actually Respond To 📋</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">Generate structured feedback surveys: themed questions, scoring guide, anonymity framework, and action planning template.</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div><label className="text-white font-semibold text-sm block mb-2">👥 Team Type *</label>
              <input value={teamType} onChange={e=>setTeamType(e.target.value)} placeholder="e.g. Engineering, Product, Remote team, Executive"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-400" /></div>
            <div><label className="text-white font-semibold text-sm block mb-2">🔢 Team Size</label>
              <input value={teamSize} onChange={e=>setTeamSize(e.target.value)} placeholder="e.g. 12 people"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-400" /></div>
            <div><label className="text-white font-semibold text-sm block mb-2">🎯 Survey Goal</label>
              <select value={surveyGoal} onChange={e=>setSurveyGoal(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-400">
                <option value="" className="bg-slate-800">Select goal...</option>
                <option value="Employee engagement" className="bg-slate-800">Employee engagement</option>
                <option value="Manager effectiveness" className="bg-slate-800">Manager effectiveness</option>
                <option value="Psychological safety" className="bg-slate-800">Psychological safety</option>
                <option value="Team health check" className="bg-slate-800">Team health check</option>
                <option value="Post-project retro" className="bg-slate-800">Post-project retro</option>
              </select></div>
            <div><label className="text-white font-semibold text-sm block mb-2">🔒 Anonymity</label>
              <select value={anonymity} onChange={e=>setAnonymity(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-400">
                <option value="" className="bg-slate-800">Select level...</option>
                <option value="Fully anonymous" className="bg-slate-800">Fully anonymous</option>
                <option value="Partially anonymous" className="bg-slate-800">Partially anonymous</option>
                <option value="Attributed" className="bg-slate-800">Attributed</option>
              </select></div>
            <div className="md:col-span-2"><label className="text-white font-semibold text-sm block mb-2">📅 Frequency</label>
              <select value={frequency} onChange={e=>setFrequency(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-400">
                <option value="" className="bg-slate-800">Select frequency...</option>
                <option value="Weekly pulse" className="bg-slate-800">Weekly pulse (3-5 questions)</option>
                <option value="Monthly pulse" className="bg-slate-800">Monthly pulse (5-7 questions)</option>
                <option value="Quarterly check-in" className="bg-slate-800">Quarterly (10-15 questions)</option>
                <option value="Annual engagement survey" className="bg-slate-800">Annual (20-30 questions)</option>
              </select></div>
          </div>
          <button onClick={generate} disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2">
            {loading ? <><span className="animate-spin text-xl">⚙️</span> Building survey...</> : <><span>📋</span> Generate Feedback Survey</>}
          </button>
        </div>
        {error && <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-5 py-3 text-red-300 text-sm">{error}</div>}
        {done && result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-violet-500/10 border-b border-violet-500/20">
              <div className="flex items-center gap-3"><span className="text-2xl">📋</span><p className="text-violet-300 font-bold text-sm">Feedback Survey: {teamType}</p></div>
              <button onClick={() => navigator.clipboard?.writeText(result)} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-xs border border-white/10">📋 Copy</button>
            </div>
            <div className="px-6 py-5">{renderMarkdown(result)}</div>
          </div>
        )}
        <p className="text-center text-xs text-slate-600">AI Team Feedback Survey · {new Date().getFullYear()} · DeepSeek</p>
      </div>
    </main>
  );
}
