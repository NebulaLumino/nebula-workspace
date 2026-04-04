"use client";

import { useState } from "react";

function renderMarkdown(text: string) {
  return text.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-white mt-7 mb-3 col-span-full">{trimmed.replace("## ","")}</h2>;
    if (trimmed.startsWith("### ")) return <h3 key={i} className="text-sm font-bold text-pink-300 mt-4 mb-2">{trimmed.replace("### ","")}</h3>;
    if (trimmed.startsWith("**") && !trimmed.includes("\n")) return <p key={i} className="text-amber-200 font-semibold text-xs mt-2 mb-0.5">{trimmed.replace(/\*\*/g,"")}</p>;
    if (trimmed.startsWith("- ")) return <li key={i} className="text-slate-300 text-xs ml-4 mb-0.5 list-disc">{trimmed.replace("- ","")}</li>;
    if (/^\d+\.\s/.test(trimmed)) return <li key={i} className="text-slate-300 text-xs ml-4 mb-0.5">{trimmed}</li>;
    if (trimmed.startsWith("|")) {
      const cells = trimmed.split("|").filter(c => c.trim() && c.trim() !== "---");
      if (cells.length > 1) {
        return (
          <div key={i} className="overflow-x-auto mb-1">
            <div className="flex gap-2 min-w-max">
              {cells.map((cell, ci) => (
                <span key={ci} className={`text-xs px-2 py-1 rounded whitespace-nowrap ${ci === 0 ? "bg-pink-500/20 text-pink-200 font-semibold" : "bg-white/5 text-slate-300"}`}>{cell.trim()}</span>
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
  const [brandName, setBrandName] = useState("");
  const [productService, setProductService] = useState("");
  const [targetInfluencer, setTargetInfluencer] = useState("");
  const [influencerType, setInfluencerType] = useState("Micro-influencer (10K-100K followers), niche content creator");
  const [collaborationType, setCollaborationType] = useState("Sponsored post, product seeding, affiliate partnership, brand ambassadorship");
  const [budget, setBudget] = useState("");
  const [platform, setPlatform] = useState("Instagram, YouTube, or TikTok");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const generate = async () => {
    if (!brandName.trim() || !productService.trim()) { setError("Brand name and product/service are required."); return; }
    setLoading(true);
    setError("");
    setResult("");
    setDone(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandName, productService, targetInfluencer, influencerType, collaborationType, budget, platform }),
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
          <span className="text-3xl">📣</span>
          <div>
            <h1 className="text-xl font-bold text-white">AI Influencer Outreach Email Generator</h1>
            <p className="text-xs text-slate-400">Influencer marketing · Cold outreach · DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Land More Brand Deals with Better Outreach 📣</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">Generate personalized cold outreach emails, collaboration offers, and negotiation scripts for any influencer tier.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🏷️ Brand Name *</label>
              <input value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="e.g. NovaTask, GlowBar, TechStack"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🎁 Product/Service to Promote *</label>
              <input value={productService} onChange={(e) => setProductService(e.target.value)} placeholder="e.g. Project management app, Skincare serum, SaaS tool"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">👤 Target Influencer (optional)</label>
              <input value={targetInfluencer} onChange={(e) => setTargetInfluencer(e.target.value)} placeholder="e.g. @janedoe, TechCreator Pro"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">📊 Influencer Tier</label>
              <select value={influencerType} onChange={(e) => setInfluencerType(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-400">
                <option value="Nano-influencer (1K-10K followers)" className="bg-slate-800">Nano (1K-10K)</option>
                <option value="Micro-influencer (10K-100K followers), niche content creator" className="bg-slate-800">Micro (10K-100K)</option>
                <option value="Mid-tier influencer (100K-500K followers)" className="bg-slate-800">Mid-Tier (100K-500K)</option>
                <option value="Macro influencer (500K-1M+ followers)" className="bg-slate-800">Macro (500K-1M+)</option>
                <option value="Celebrity / Mega influencer (1M+ followers)" className="bg-slate-800">Celebrity (1M+)</option>
              </select>
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🤝 Collaboration Type</label>
              <select value={collaborationType} onChange={(e) => setCollaborationType(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-400">
                <option value="Sponsored post, product seeding, affiliate partnership, brand ambassadorship" className="bg-slate-800">Multiple options</option>
                <option value="Sponsored post" className="bg-slate-800">Sponsored post</option>
                <option value="Product seeding / gifting" className="bg-slate-800">Product seeding / gifting</option>
                <option value="Affiliate / revenue share partnership" className="bg-slate-800">Affiliate / revenue share</option>
                <option value="Long-term brand ambassadorship" className="bg-slate-800">Brand ambassadorship</option>
                <option value="TikTok challenge / viral campaign" className="bg-slate-800">TikTok challenge</option>
              </select>
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">💰 Budget Range</label>
              <input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="e.g. $500-$2,000 per post, 15% affiliate"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-400" />
            </div>
            <div className="md:col-span-2">
              <label className="text-white font-semibold text-sm block mb-2">📱 Platform</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-400">
                <option value="Instagram, YouTube, or TikTok" className="bg-slate-800">All platforms</option>
                <option value="Instagram (Reels + Stories + Feed)" className="bg-slate-800">Instagram</option>
                <option value="YouTube (Shorts + Long-form)" className="bg-slate-800">YouTube</option>
                <option value="TikTok" className="bg-slate-800">TikTok</option>
                <option value="LinkedIn" className="bg-slate-800">LinkedIn</option>
                <option value="Twitter / X" className="bg-slate-800">Twitter / X</option>
              </select>
            </div>
          </div>

          <button onClick={generate} disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2">
            {loading ? <><span className="animate-spin text-xl">⚙️</span> Crafting outreach...</> : <><span>📣</span> Generate Influencer Outreach</>}
          </button>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-5 py-3 text-red-300 text-sm">{error}</div>}

        {done && result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-pink-500/10 border-b border-pink-500/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📣</span>
                <p className="text-pink-300 font-bold text-sm">Influencer Outreach: {brandName}</p>
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

        <p className="text-center text-xs text-slate-600">AI Influencer Outreach Email Generator · {new Date().getFullYear()} · DeepSeek</p>
      </div>
    </main>
  );
}
