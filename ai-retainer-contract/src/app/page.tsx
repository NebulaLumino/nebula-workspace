"use client";

import { useState } from "react";

function renderContract(text: string) {
  return text.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("---")) return <div key={i} className="border-t border-dashed border-white/10 my-4" />;
    if (trimmed.startsWith("## ") && !trimmed.startsWith("## 1.")) return <h2 key={i} className="text-xl font-bold text-white mt-7 mb-3">{trimmed.replace("## ","")}</h2>;
    if (trimmed.startsWith("### ")) return <h3 key={i} className="text-sm font-bold text-emerald-300 mt-4 mb-2">{trimmed.replace("### ","")}</h3>;
    if (/^#{1,3}\s+\d+\./.test(trimmed)) return <h3 key={i} className="text-sm font-bold text-emerald-300 mt-3 mb-1">{trimmed.replace(/^#{1,3}\s+/,"")}</h3>;
    if (trimmed.startsWith("**") && !trimmed.includes("\n")) return <p key={i} className="text-amber-200 font-semibold text-xs mt-2 mb-0.5">{trimmed.replace(/\*\*/g,"")}</p>;
    if (trimmed.startsWith("- [ ]") || trimmed.startsWith("- [") || trimmed.startsWith("- ")) return <li key={i} className="text-slate-300 text-xs ml-4 mb-0.5 list-disc">{trimmed.replace(/^-\s*/,"")}</li>;
    if (/^\d+\.\s/.test(trimmed) && !trimmed.includes("|")) return <li key={i} className="text-slate-300 text-xs ml-4 mb-0.5">{trimmed}</li>;
    if (trimmed.startsWith("|")) {
      const cells = trimmed.split("|").filter(c => c.trim() && c.trim() !== "---");
      if (cells.length > 1) {
        return (
          <div key={i} className="overflow-x-auto mb-1">
            <div className="flex gap-1 min-w-max">
              {cells.map((cell, ci) => (
                <span key={ci} className={`text-xs px-2 py-1 rounded whitespace-nowrap ${ci === 0 ? "bg-emerald-500/20 text-emerald-200 font-semibold" : "bg-white/5 text-slate-300"}`}>{cell.trim()}</span>
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
  const [serviceProvider, setServiceProvider] = useState("");
  const [clientName, setClientName] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [monthlyRetainer, setMonthlyRetainer] = useState("");
  const [contractLength, setContractLength] = useState("");
  const [startDate, setStartDate] = useState("");
  const [scope, setScope] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const generate = async () => {
    if (!serviceProvider.trim() || !clientName.trim()) { setError("Service provider and client name are required."); return; }
    setLoading(true);
    setError("");
    setResult("");
    setDone(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceProvider, clientName, serviceType, monthlyRetainer, contractLength, startDate, scope }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Generation failed."); return; }
      setResult(data.result);
      setDone(true);
    } catch { setError("Failed to connect."); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">
      <header className="border-b border-white/10 sticky top-0 z-10 bg-slate-950/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">📄</span>
          <div>
            <h1 className="text-xl font-bold text-white">AI Retainer Contract Generator</h1>
            <p className="text-xs text-slate-400">Professional services · Legal agreements · DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Get Professional Contracts in Minutes 📄</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">Generate a complete retainer agreement with signature blocks, SOW templates, and management best practices.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🏢 Service Provider / Consultant *</label>
              <input value={serviceProvider} onChange={(e) => setServiceProvider(e.target.value)} placeholder="e.g. Jane Smith / Smith Consulting LLC"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">👤 Client Name *</label>
              <input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="e.g. Acme Corp / John Doe"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🛠️ Type of Service</label>
              <select value={serviceType} onChange={(e) => setServiceType(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400">
                <option value="" className="bg-slate-800">Select service type...</option>
                <option value="Digital marketing / advertising" className="bg-slate-800">Digital marketing / advertising</option>
                <option value="Business / strategy consulting" className="bg-slate-800">Business / strategy consulting</option>
                <option value="Creative / design services" className="bg-slate-800">Creative / design services</option>
                <option value="Software development" className="bg-slate-800">Software development</option>
                <option value="Legal / compliance services" className="bg-slate-800">Legal / compliance services</option>
                <option value="PR / communications" className="bg-slate-800">PR / communications</option>
                <option value="Recruitment / HR services" className="bg-slate-800">Recruitment / HR services</option>
                <option value="Other professional services" className="bg-slate-800">Other professional services</option>
              </select>
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">💰 Monthly Retainer Amount</label>
              <input value={monthlyRetainer} onChange={(e) => setMonthlyRetainer(e.target.value)} placeholder="e.g. $8,000/month, $15,000/month"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">📅 Contract Length</label>
              <select value={contractLength} onChange={(e) => setContractLength(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400">
                <option value="" className="bg-slate-800">Select contract length...</option>
                <option value="3 months (renewable)" className="bg-slate-800">3 months (renewable)</option>
                <option value="6 months (renewable)" className="bg-slate-800">6 months (renewable)</option>
                <option value="12 months (renewable)" className="bg-slate-800">12 months (renewable)</option>
                <option value="Month-to-month" className="bg-slate-800">Month-to-month</option>
              </select>
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🗓️ Start Date</label>
              <input value={startDate} onChange={(e) => setStartDate(e.target.value)} type="date"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
            <div className="md:col-span-2">
              <label className="text-white font-semibold text-sm block mb-2">📋 Scope of Work</label>
              <textarea value={scope} onChange={(e) => setScope(e.target.value)} rows={3}
                placeholder="e.g. Monthly strategic consulting, social media management (4 posts/week), paid ads management and optimization, monthly reporting..."
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none" />
            </div>
          </div>

          <button onClick={generate} disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2">
            {loading ? <><span className="animate-spin text-xl">⚙️</span> Drafting contract...</> : <><span>📄</span> Generate Retainer Contract</>}
          </button>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-5 py-3 text-red-300 text-sm">{error}</div>}

        {done && result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-emerald-500/10 border-b border-emerald-500/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📄</span>
                <p className="text-emerald-300 font-bold text-sm">Retainer Contract: {serviceProvider} → {clientName}</p>
              </div>
              <button onClick={() => navigator.clipboard?.writeText(result)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-xs border border-white/10 transition-all">
                📋 Copy All
              </button>
            </div>
            <div className="px-6 py-5">
              {renderContract(result)}
            </div>
          </div>
        )}

        <p className="text-center text-xs text-slate-600">AI Retainer Contract Generator · {new Date().getFullYear()} · DeepSeek · Not legal advice</p>
      </div>
    </main>
  );
}
