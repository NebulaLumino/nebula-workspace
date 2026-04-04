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
  const [clientName, setClientName] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [duration, setDuration] = useState("");
  const [monthlyValue, setMonthlyValue] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [team, setTeam] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const generate = async () => {
    if (!clientName.trim()) { setError("Client name is required."); return; }
    setLoading(true); setError(""); setResult(""); setDone(false);
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientName, serviceType, duration, monthlyValue, deliverables, team, paymentTerms }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Generation failed."); return; }
      setResult(data.result); setDone(true);
    } catch { setError("Failed to connect."); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950">
      <header className="border-b border-white/10 sticky top-0 z-10 bg-slate-950/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">📋</span>
          <div>
            <h1 className="text-xl font-bold text-white">AI Retainer SOW Generator</h1>
            <p className="text-xs text-slate-400">Consulting · Agency · DeepSeek</p>
          </div>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Generate Professional Retainer SOWs in Minutes 📋</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">Complete retainer scopes of work: deliverables, exclusions, payment terms, change requests, and acceptance criteria.</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div><label className="text-white font-semibold text-sm block mb-2">🏢 Client Name *</label>
              <input value={clientName} onChange={e=>setClientName(e.target.value)} placeholder="e.g. Acme Corp"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400" /></div>
            <div><label className="text-white font-semibold text-sm block mb-2">🛠️ Service Type</label>
              <select value={serviceType} onChange={e=>setServiceType(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
                <option value="" className="bg-slate-800">Select type...</option>
                <option value="Marketing Agency" className="bg-slate-800">Marketing Agency</option>
                <option value="Legal Services" className="bg-slate-800">Legal Services</option>
                <option value="Consulting" className="bg-slate-800">Consulting</option>
                <option value="Fractional Executive" className="bg-slate-800">Fractional Executive</option>
                <option value="Accounting / Finance" className="bg-slate-800">Accounting / Finance</option>
                <option value="IT Services" className="bg-slate-800">IT Services</option>
              </select></div>
            <div><label className="text-white font-semibold text-sm block mb-2">📅 Duration</label>
              <input value={duration} onChange={e=>setDuration(e.target.value)} placeholder="e.g. 12 months, renewable"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400" /></div>
            <div><label className="text-white font-semibold text-sm block mb-2">💰 Monthly Value</label>
              <input value={monthlyValue} onChange={e=>setMonthlyValue(e.target.value)} placeholder="e.g. $5,000/month"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400" /></div>
            <div><label className="text-white font-semibold text-sm block mb-2">👥 Team</label>
              <input value={team} onChange={e=>setTeam(e.target.value)} placeholder="e.g. Account lead + 2 specialists"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400" /></div>
            <div><label className="text-white font-semibold text-sm block mb-2">💳 Payment Terms</label>
              <input value={paymentTerms} onChange={e=>setPaymentTerms(e.target.value)} placeholder="e.g. Net 30, invoiced monthly"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400" /></div>
            <div className="md:col-span-2"><label className="text-white font-semibold text-sm block mb-2">📦 Deliverables</label>
              <textarea value={deliverables} onChange={e=>setDeliverables(e.target.value)} rows={2} placeholder="e.g. Monthly content calendar, 4 blog posts, social media management (20 posts/month)..."
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none" /></div>
          </div>
          <button onClick={generate} disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2">
            {loading ? <><span className="animate-spin text-xl">⚙️</span> Generating SOW...</> : <><span>📋</span> Generate Retainer SOW</>}
          </button>
        </div>
        {error && <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-5 py-3 text-red-300 text-sm">{error}</div>}
        {done && result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-amber-500/10 border-b border-amber-500/20">
              <div className="flex items-center gap-3"><span className="text-2xl">📋</span><p className="text-amber-300 font-bold text-sm">Retainer SOW: {clientName}</p></div>
              <button onClick={() => navigator.clipboard?.writeText(result)} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-xs border border-white/10">📋 Copy</button>
            </div>
            <div className="px-6 py-5">{renderMarkdown(result)}</div>
          </div>
        )}
        <p className="text-center text-xs text-slate-600">AI Retainer SOW Generator · {new Date().getFullYear()} · DeepSeek</p>
      </div>
    </main>
  );
}
