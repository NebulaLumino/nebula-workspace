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
  const [contractType, setContractType] = useState("");
  const [counterparty, setCounterparty] = useState("");
  const [changes, setChanges] = useState("");
  const [yourPosition, setYourPosition] = useState("");
  const [concerns, setConcerns] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const generate = async () => {
    if (!contractType.trim()) { setError("Contract type is required."); return; }
    setLoading(true);
    setError("");
    setResult("");
    setDone(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractType, counterparty, changes, yourPosition, concerns }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Analysis failed."); return; }
      setResult(data.result);
      setDone(true);
    } catch { setError("Failed to connect."); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <header className="border-b border-white/10 sticky top-0 z-10 bg-slate-950/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">📄</span>
          <div>
            <h1 className="text-xl font-bold text-white">AI Contract Redline Summary</h1>
            <p className="text-xs text-slate-400">Legal tech · Contract analysis · DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Understand Any Contract Before You Sign 📄</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">Paste key contract terms or redlines, get a business risk analysis: risk tiers, negotiating priorities, liability, IP, and recommended actions.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-white font-semibold text-sm block mb-2">📄 Contract Type *</label>
              <select value={contractType} onChange={(e) => setContractType(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                <option value="" className="bg-slate-800">Select type...</option>
                <option value="MSA (Master Service Agreement)" className="bg-slate-800">MSA (Master Service Agreement)</option>
                <option value="SaaS Subscription Agreement" className="bg-slate-800">SaaS Subscription Agreement</option>
                <option value="SOW (Statement of Work)" className="bg-slate-800">SOW (Statement of Work)</option>
                <option value="Partnership Agreement" className="bg-slate-800">Partnership Agreement</option>
                <option value="NDA (Non-Disclosure Agreement)" className="bg-slate-800">NDA</option>
                <option value="Employment Agreement" className="bg-slate-800">Employment Agreement</option>
                <option value="Vendor / Supplier Contract" className="bg-slate-800">Vendor / Supplier Contract</option>
              </select>
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🏢 Counterparty</label>
              <input value={counterparty} onChange={(e) => setCounterparty(e.target.value)} placeholder="e.g. Acme Corp, Salesforce, PartnerName"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">⚖️ Your Position</label>
              <select value={yourPosition} onChange={(e) => setYourPosition(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                <option value="" className="bg-slate-800">Select position...</option>
                <option value="Buyer / Customer" className="bg-slate-800">Buyer / Customer</option>
                <option value="Seller / Vendor" className="bg-slate-800">Seller / Vendor</option>
                <option value="Partner" className="bg-slate-800">Partner</option>
                <option value="Service Provider" className="bg-slate-800">Service Provider</option>
              </select>
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">⚠️ Specific Concerns</label>
              <input value={concerns} onChange={(e) => setConcerns(e.target.value)} placeholder="e.g. Unlimited liability, auto-renewal, IP ownership"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div className="md:col-span-2">
              <label className="text-white font-semibold text-sm block mb-2">📋 Key Terms / Redline Changes *</label>
              <textarea value={changes} onChange={(e) => setChanges(e.target.value)} rows={10}
                placeholder="Paste key contract sections, redline changes, or important terms to analyze...&#10;&#10;e.g.&#10;- Term: 2 years, auto-renewal for 1 year unless 60 days notice&#10;- Liability: unlimited for confidentiality breach&#10;- IP: all work product assigned to client&#10;- Termination: either party can terminate for convenience with 30 days notice"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-y font-mono" />
            </div>
          </div>

          <button onClick={generate} disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2">
            {loading ? <><span className="animate-spin text-xl">⚙️</span> Analyzing contract...</> : <><span>📄</span> Analyze Contract</>}
          </button>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-5 py-3 text-red-300 text-sm">{error}</div>}

        {done && result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-indigo-500/10 border-b border-indigo-500/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📄</span>
                <p className="text-indigo-300 font-bold text-sm">Contract Analysis: {contractType}</p>
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

        <p className="text-center text-xs text-slate-600">AI Contract Redline Summary · {new Date().getFullYear()} · DeepSeek</p>
      </div>
    </main>
  );
}
