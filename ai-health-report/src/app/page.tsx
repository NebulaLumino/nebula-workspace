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
  const [customerName, setCustomerName] = useState("");
  const [accountTier, setAccountTier] = useState("");
  const [healthScore, setHealthScore] = useState("");
  const [productUsage, setProductUsage] = useState("");
  const [supportTickets, setSupportTickets] = useState("");
  const [contractValue, setContractValue] = useState("");
  const [lastContact, setLastContact] = useState("");
  const [renewalDate, setRenewalDate] = useState("");
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const generate = async () => {
    if (!customerName.trim()) { setError("Customer name is required."); return; }
    setLoading(true);
    setError("");
    setResult("");
    setDone(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName, accountTier, healthScore, productUsage, supportTickets, contractValue, lastContact, renewalDate, notes }),
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
          <span className="text-3xl">❤️‍🔥</span>
          <div>
            <h1 className="text-xl font-bold text-white">AI Customer Health Report</h1>
            <p className="text-xs text-slate-400">Customer success · Retention · DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Spot Risks Before They Become Churn ❤️‍🔥</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">Generate comprehensive customer health reports: risk analysis, engagement gaps, expansion plays, and a CSM playbook — ready for your next QBR.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🏢 Customer Name *</label>
              <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. Acme Corp, DataFlow Inc."
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🏷️ Account Tier</label>
              <select value={accountTier} onChange={(e) => setAccountTier(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
                <option value="" className="bg-slate-800">Select tier...</option>
                <option value="Enterprise" className="bg-slate-800">Enterprise ($100K+ ARR)</option>
                <option value="Mid-Market" className="bg-slate-800">Mid-Market ($25K-$100K ARR)</option>
                <option value="SMB" className="bg-slate-800">SMB (under $25K ARR)</option>
              </select>
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">❤️‍🔥 Health Score</label>
              <input value={healthScore} onChange={(e) => setHealthScore(e.target.value)} placeholder="e.g. 85/100 — Healthy / 40/100 — At-Risk"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">💰 Contract Value</label>
              <input value={contractValue} onChange={(e) => setContractValue(e.target.value)} placeholder="e.g. $150K ARR, 3-year deal"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
            <div className="md:col-span-2">
              <label className="text-white font-semibold text-sm block mb-2">📊 Product Usage Data</label>
              <textarea value={productUsage} onChange={(e) => setProductUsage(e.target.value)} rows={2}
                placeholder="e.g. Daily active users: 45, feature adoption: 60%, API calls: 2M/month, active seats: 80/120..."
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none" />
            </div>
            <div className="md:col-span-2">
              <label className="text-white font-semibold text-sm block mb-2">🎫 Support Tickets</label>
              <textarea value={supportTickets} onChange={(e) => setSupportTickets(e.target.value)} rows={2}
                placeholder="e.g. 3 open tickets (1 blocker), SLA compliance: 85%, trend: improving, last 90 days: 12 tickets..."
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">📅 Renewal Date</label>
              <input value={renewalDate} onChange={(e) => setRenewalDate(e.target.value)} placeholder="e.g. March 2027, Q2 2027"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🕐 Last Contact</label>
              <input value={lastContact} onChange={(e) => setLastContact(e.target.value)} placeholder="e.g. 14 days ago, last QBR 45 days ago"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
            <div className="md:col-span-2">
              <label className="text-white font-semibold text-sm block mb-2">📝 CSM Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
                placeholder="e.g. Champion (Sarah, VP Ops) is very happy. New CFO evaluating tools. Competitor (Salesforce) pitching hard..."
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none" />
            </div>
          </div>

          <button onClick={generate} disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2">
            {loading ? <><span className="animate-spin text-xl">⚙️</span> Generating health report...</> : <><span>❤️‍🔥</span> Generate Health Report</>}
          </button>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-5 py-3 text-red-300 text-sm">{error}</div>}

        {done && result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-teal-500/10 border-b border-teal-500/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">❤️‍🔥</span>
                <p className="text-teal-300 font-bold text-sm">Health Report: {customerName}</p>
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

        <p className="text-center text-xs text-slate-600">AI Customer Health Report · {new Date().getFullYear()} · DeepSeek</p>
      </div>
    </main>
  );
}
