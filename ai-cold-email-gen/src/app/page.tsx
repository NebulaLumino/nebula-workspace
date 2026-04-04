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
  const [product, setProduct] = useState("");
  const [targetPerson, setTargetPerson] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [company, setCompany] = useState("");
  const [painPoint, setPainPoint] = useState("");
  const [offer, setOffer] = useState("");
  const [cta, setCta] = useState("");
  const [tone, setTone] = useState("");
  const [numVariants, setNumVariants] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const generate = async () => {
    if (!product.trim()) { setError("Product/service name is required."); return; }
    setLoading(true);
    setError("");
    setResult("");
    setDone(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, targetPerson, targetRole, company, painPoint, offer, cta, tone, numVariants }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Generation failed."); return; }
      setResult(data.result);
      setDone(true);
    } catch { setError("Failed to connect."); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950">
      <header className="border-b border-white/10 sticky top-0 z-10 bg-slate-950/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">📧</span>
          <div>
            <h1 className="text-xl font-bold text-white">AI Cold Email Writer</h1>
            <p className="text-xs text-slate-400">Sales outreach · Sequences · DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Write Cold Emails That Actually Get Read 📧</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">Generate multi-variant cold email sequences: subject lines, body copy, follow-ups, breakup emails, and personalization playbooks.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🏷️ Your Product/Service *</label>
              <input value={product} onChange={(e) => setProduct(e.target.value)} placeholder="e.g. AI-powered project management tool"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">👤 Target Person</label>
              <input value={targetPerson} onChange={(e) => setTargetPerson(e.target.value)} placeholder="e.g. John Smith, VP of Operations"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">💼 Target Role</label>
              <input value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="e.g. VP of Operations, Head of RevOps"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🏢 Company Profile</label>
              <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Mid-market SaaS, 50-200 employees"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
            </div>
            <div className="md:col-span-2">
              <label className="text-white font-semibold text-sm block mb-2">😤 Their Pain Point</label>
              <textarea value={painPoint} onChange={(e) => setPainPoint(e.target.value)} rows={2}
                placeholder="e.g. Teams working in silos, priorities shift constantly, no single source of truth for projects..."
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none" />
            </div>
            <div className="md:col-span-2">
              <label className="text-white font-semibold text-sm block mb-2">🎯 Your Offer</label>
              <input value={offer} onChange={(e) => setOffer(e.target.value)} placeholder="e.g. 30-min consultation to show how NovaTask gives teams a single source of truth"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">📲 Call to Action</label>
              <input value={cta} onChange={(e) => setCta(e.target.value)} placeholder="e.g. Schedule a 30-min call this week"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🎨 Tone</label>
              <select value={tone} onChange={(e) => setTone(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400">
                <option value="" className="bg-slate-800">Genuine / curious (default)</option>
                <option value="Bold and direct" className="bg-slate-800">Bold and direct</option>
                <option value="Casual and friendly" className="bg-slate-800">Casual and friendly</option>
                <option value="Formal and professional" className="bg-slate-800">Formal and professional</option>
                <option value="Playful and witty" className="bg-slate-800">Playful and witty</option>
              </select>
            </div>
          </div>

          <button onClick={generate} disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2">
            {loading ? <><span className="animate-spin text-xl">⚙️</span> Writing emails...</> : <><span>📧</span> Generate Cold Email Sequences</>}
          </button>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-5 py-3 text-red-300 text-sm">{error}</div>}

        {done && result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-cyan-500/10 border-b border-cyan-500/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📧</span>
                <p className="text-cyan-300 font-bold text-sm">Cold Email Sequences: {product}</p>
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

        <p className="text-center text-xs text-slate-600">AI Cold Email Writer · {new Date().getFullYear()} · DeepSeek</p>
      </div>
    </main>
  );
}
