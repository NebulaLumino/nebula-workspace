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
    if (trimmed.startsWith("|")) return null;
    if (trimmed === "") return <div key={i} className="h-1.5" />;
    return <p key={i} className="text-slate-300 text-xs leading-relaxed mb-0.5">{trimmed}</p>;
  });
}

export default function Home() {
  const [role, setRole] = useState("");
  const [seniority, setSeniority] = useState("");
  const [department, setDepartment] = useState("");
  const [company, setCompany] = useState("");
  const [keyRequirements, setKeyRequirements] = useState("");
  const [interviewRounds, setInterviewRounds] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const generate = async () => {
    if (!role.trim()) { setError("Role is required."); return; }
    setLoading(true);
    setError("");
    setResult("");
    setDone(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, seniority, department, company, keyRequirements, interviewRounds }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Generation failed."); return; }
      setResult(data.result);
      setDone(true);
    } catch { setError("Failed to connect."); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-pink-950">
      <header className="border-b border-white/10 sticky top-0 z-10 bg-slate-950/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">� scorerard</span>
          <div>
            <h1 className="text-xl font-bold text-white">AI Recruitment Scorecard</h1>
            <p className="text-xs text-slate-400">Talent acquisition · Hiring · DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Hire Better with Structured Scorecards � scorerard</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">Generate complete recruitment scorecards: competencies, behavioral questions, evaluation rubrics, reference checks, and offer decision matrix.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-white font-semibold text-sm block mb-2">💼 Role *</label>
              <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Senior Product Manager, Staff Engineer"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">📊 Seniority</label>
              <select value={seniority} onChange={(e) => setSeniority(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-400">
                <option value="" className="bg-slate-800">Select level...</option>
                <option value="Junior / Entry" className="bg-slate-800">Junior / Entry</option>
                <option value="Mid-level" className="bg-slate-800">Mid-level</option>
                <option value="Senior" className="bg-slate-800">Senior</option>
                <option value="Staff / Principal" className="bg-slate-800">Staff / Principal</option>
                <option value="Manager / Lead" className="bg-slate-800">Manager / Lead</option>
                <option value="Director" className="bg-slate-800">Director</option>
                <option value="VP / Executive" className="bg-slate-800">VP / Executive</option>
              </select>
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🏗️ Department</label>
              <select value={department} onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-400">
                <option value="" className="bg-slate-800">Select department...</option>
                <option value="Engineering" className="bg-slate-800">Engineering</option>
                <option value="Product" className="bg-slate-800">Product</option>
                <option value="Design" className="bg-slate-800">Design</option>
                <option value="Sales" className="bg-slate-800">Sales</option>
                <option value="Marketing" className="bg-slate-800">Marketing</option>
                <option value="Customer Success" className="bg-slate-800">Customer Success</option>
                <option value="Operations" className="bg-slate-800">Operations</option>
              </select>
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🏢 Company</label>
              <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. NovaTask Inc., Series B startup"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-400" />
            </div>
            <div className="md:col-span-2">
              <label className="text-white font-semibold text-sm block mb-2">🔑 Key Requirements</label>
              <input value={keyRequirements} onChange={(e) => setKeyRequirements(e.target.value)} placeholder="e.g. 5+ years PM experience, B2B SaaS background, SQL proficiency"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-400" />
            </div>
            <div className="md:col-span-2">
              <label className="text-white font-semibold text-sm block mb-2">📋 Interview Rounds</label>
              <input value={interviewRounds} onChange={(e) => setInterviewRounds(e.target.value)} placeholder="e.g. 5 rounds: Recruiter, HM, Technical, Team, Executive"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-400" />
            </div>
          </div>

          <button onClick={generate} disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2">
            {loading ? <><span className="animate-spin text-xl">⚙️</span> Building scorecard...</> : <><span>� scorerard</span> Generate Scorecard</>}
          </button>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-5 py-3 text-red-300 text-sm">{error}</div>}

        {done && result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-pink-500/10 border-b border-pink-500/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">� scorerard</span>
                <p className="text-pink-300 font-bold text-sm">Scorecard: {role}</p>
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

        <p className="text-center text-xs text-slate-600">AI Recruitment Scorecard · {new Date().getFullYear()} · DeepSeek</p>
      </div>
    </main>
  );
}
