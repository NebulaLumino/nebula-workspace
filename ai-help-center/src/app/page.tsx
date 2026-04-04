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
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("");
  const [userTypes, setUserTypes] = useState("");
  const [supportVolume, setSupportVolume] = useState("");
  const [topics, setTopics] = useState("");
  const [existingCategories, setExistingCategories] = useState("");
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
        body: JSON.stringify({ productName, productType, userTypes, supportVolume, topics, existingCategories }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Generation failed."); return; }
      setResult(data.result);
      setDone(true);
    } catch { setError("Failed to connect."); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-green-950">
      <header className="border-b border-white/10 sticky top-0 z-10 bg-slate-950/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">🆘</span>
          <div>
            <h1 className="text-xl font-bold text-white">AI Help Center Category Builder</h1>
            <p className="text-xs text-slate-400">Support strategy · Information architecture · DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Build a Help Center Users Actually Find Useful 🆘</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">Generate complete help center taxonomies: categories, subcategories, article templates, search optimization, and maintenance roadmap.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🏷️ Product Name *</label>
              <input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g. NovaTask Pro, CloudSync CRM"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🏭 Product Type</label>
              <select value={productType} onChange={(e) => setProductType(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
                <option value="" className="bg-slate-800">Select type...</option>
                <option value="B2B SaaS" className="bg-slate-800">B2B SaaS</option>
                <option value="B2C App" className="bg-slate-800">B2C App</option>
                <option value="Project management tool" className="bg-slate-800">Project management tool</option>
                <option value="CRM" className="bg-slate-800">CRM</option>
                <option value="Developer API / SDK" className="bg-slate-800">Developer API / SDK</option>
                <option value="E-commerce platform" className="bg-slate-800">E-commerce platform</option>
              </select>
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">👥 User Types</label>
              <input value={userTypes} onChange={(e) => setUserTypes(e.target.value)} placeholder="e.g. Admins, users, API developers, billing managers"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">📊 Monthly Support Volume</label>
              <select value={supportVolume} onChange={(e) => setSupportVolume(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
                <option value="" className="bg-slate-800">Select volume...</option>
                <option value="Low (under 50 tickets/month)" className="bg-slate-800">Low (under 50 tickets/month)</option>
                <option value="Medium (50-200 tickets/month)" className="bg-slate-800">Medium (50-200/month)</option>
                <option value="High (200+ tickets/month)" className="bg-slate-800">High (200+ tickets/month)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-white font-semibold text-sm block mb-2">💬 Common Support Topics</label>
              <input value={topics} onChange={(e) => setTopics(e.target.value)} placeholder="e.g. Getting started, integrations, billing, feature questions, troubleshooting"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-400" />
            </div>
            <div className="md:col-span-2">
              <label className="text-white font-semibold text-sm block mb-2">📁 Existing Categories (if any)</label>
              <textarea value={existingCategories} onChange={(e) => setExistingCategories(e.target.value)} rows={2}
                placeholder="Describe what categories already exist (or leave blank for a fresh build)"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none" />
            </div>
          </div>

          <button onClick={generate} disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2">
            {loading ? <><span className="animate-spin text-xl">⚙️</span> Building categories...</> : <><span>🆘</span> Generate Help Center</>}
          </button>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-5 py-3 text-red-300 text-sm">{error}</div>}

        {done && result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-green-500/10 border-b border-green-500/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🆘</span>
                <p className="text-green-300 font-bold text-sm">Help Center: {productName}</p>
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

        <p className="text-center text-xs text-slate-600">AI Help Center Category Builder · {new Date().getFullYear()} · DeepSeek</p>
      </div>
    </main>
  );
}
