"use client";

import { useState } from "react";

function renderMarkdown(text: string) {
  return text.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-white mt-7 mb-3 col-span-full">{trimmed.replace("## ","")}</h2>;
    if (trimmed.startsWith("### 60-Second")) return <h3 key={i} className="text-sm font-bold text-amber-300 mt-4 mb-1">{trimmed}</h3>;
    if (trimmed.startsWith("### ")) return <h3 key={i} className="text-sm font-bold text-orange-300 mt-4 mb-2">{trimmed.replace("### ","")}</h3>;
    if (trimmed.startsWith("**") && !trimmed.includes("\n")) return <p key={i} className="text-amber-200 font-semibold text-xs mt-2 mb-0.5">{trimmed.replace(/\*\*/g,"")}</p>;
    if (trimmed.startsWith("- ")) return <li key={i} className="text-slate-300 text-xs ml-4 mb-0.5 list-disc">{trimmed.replace("- ","")}</li>;
    if (/^\d+\.\s/.test(trimmed) && !trimmed.includes("|")) return <li key={i} className="text-slate-300 text-xs ml-4 mb-0.5">{trimmed}</li>;
    if (trimmed === "") return <div key={i} className="h-1.5" />;
    return <p key={i} className="text-slate-300 text-xs leading-relaxed mb-0.5">{trimmed}</p>;
  });
}

export default function Home() {
  const [founderName, setFounderName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [foundingStory, setFoundingStory] = useState("");
  const [keyChallenge, setKeyChallenge] = useState("");
  const [keyLesson, setKeyLesson] = useState("");
  const [audience, setAudience] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const generate = async () => {
    if (!companyName.trim()) { setError("Company name is required."); return; }
    setLoading(true);
    setError("");
    setResult("");
    setDone(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ founderName, companyName, industry, foundingStory, keyChallenge, keyLesson, audience }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Generation failed."); return; }
      setResult(data.result);
      setDone(true);
    } catch { setError("Failed to connect."); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950">
      <header className="border-b border-white/10 sticky top-0 z-10 bg-slate-950/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">🚀</span>
          <div>
            <h1 className="text-xl font-bold text-white">AI Founder Story Generator</h1>
            <p className="text-xs text-slate-400">Brand storytelling · Authentic narratives · DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Tell the Story That Makes People Believe 🚀</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">Generate a complete founder story package: long-form narrative, bios, press kit, investor pitch, and hiring story.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-white font-semibold text-sm block mb-2">👤 Founder Name</label>
              <input value={founderName} onChange={(e) => setFounderName(e.target.value)} placeholder="e.g. Sarah Chen, Alex Rivera"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🏢 Company Name *</label>
              <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. NovaTask, Lumiere, DataFlow"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🏭 Industry</label>
              <select value={industry} onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                <option value="" className="bg-slate-800">Select industry...</option>
                <option value="Technology / SaaS" className="bg-slate-800">Technology / SaaS</option>
                <option value="Consumer / E-commerce" className="bg-slate-800">Consumer / E-commerce</option>
                <option value="Fintech / Finance" className="bg-slate-800">Fintech / Finance</option>
                <option value="Healthcare / BioTech" className="bg-slate-800">Healthcare / BioTech</option>
                <option value="EdTech / Education" className="bg-slate-800">EdTech / Education</option>
                <option value="Climate / CleanTech" className="bg-slate-800">Climate / CleanTech</option>
                <option value="Social Impact / Non-profit" className="bg-slate-800">Social Impact</option>
              </select>
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">👥 Target Audience</label>
              <select value={audience} onChange={(e) => setAudience(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                <option value="" className="bg-slate-800">All audiences</option>
                <option value="Investors / VCs" className="bg-slate-800">Investors / VCs</option>
                <option value="Customers / Users" className="bg-slate-800">Customers / Users</option>
                <option value="Press / Media" className="bg-slate-800">Press / Media</option>
                <option value="Potential Hires" className="bg-slate-800">Potential Hires</option>
                <option value="Partners / Enterprise buyers" className="bg-slate-800">Partners / Enterprise buyers</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-white font-semibold text-sm block mb-2">💡 Founding Story Summary</label>
              <textarea value={foundingStory} onChange={(e) => setFoundingStory(e.target.value)} rows={3}
                placeholder="e.g. Started after I spent 10 years in healthcare and realized patient data was a mess. Built the first version in a weekend..."
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">⚡ Key Challenge Overcome</label>
              <input value={keyChallenge} onChange={(e) => setKeyChallenge(e.target.value)} placeholder="e.g. Ran out of money twice, built wrong product, lost cofounder"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">📝 Key Lesson Learned</label>
              <input value={keyLesson} onChange={(e) => setKeyLesson(e.target.value)} placeholder="e.g. Talk to customers before you build, hire slowly, cash is king"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
          </div>

          <button onClick={generate} disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2">
            {loading ? <><span className="animate-spin text-xl">⚙️</span> Crafting your story...</> : <><span>🚀</span> Generate Founder Story</>}
          </button>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-5 py-3 text-red-300 text-sm">{error}</div>}

        {done && result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-orange-500/10 border-b border-orange-500/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚀</span>
                <p className="text-orange-300 font-bold text-sm">Founder Story: {companyName}</p>
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

        <p className="text-center text-xs text-slate-600">AI Founder Story Generator · {new Date().getFullYear()} · DeepSeek</p>
      </div>
    </main>
  );
}
