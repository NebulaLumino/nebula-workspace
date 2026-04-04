"use client";

import { useState } from "react";

function renderMarkdown(text: string) {
  return text.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-white mt-7 mb-3 col-span-full">{trimmed.replace("## ","")}</h2>;
    if (trimmed.startsWith("### ")) return <h3 key={i} className="text-sm font-bold text-rose-300 mt-4 mb-2">{trimmed.replace("### ","")}</h3>;
    if (trimmed.startsWith("**") && !trimmed.includes("\n")) return <p key={i} className="text-amber-200 font-semibold text-xs mt-2 mb-0.5">{trimmed.replace(/\*\*/g,"")}</p>;
    if (trimmed.startsWith("- ")) return <li key={i} className="text-slate-300 text-xs ml-4 mb-0.5 list-disc">{trimmed.replace("- ","")}</li>;
    if (/^\d+\.\s/.test(trimmed)) return <li key={i} className="text-slate-300 text-xs ml-4 mb-0.5">{trimmed}</li>;
    if (trimmed === "") return <div key={i} className="h-1.5" />;
    return <p key={i} className="text-slate-300 text-xs leading-relaxed mb-0.5">{trimmed}</p>;
  });
}

export default function Home() {
  const [businessType, setBusinessType] = useState("");
  const [customerSegments, setCustomerSegments] = useState("");
  const [subscriptionTiers, setSubscriptionTiers] = useState("");
  const [churnDrivers, setChurnDrivers] = useState("");
  const [healthMetrics, setHealthMetrics] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const generate = async () => {
    if (!businessType.trim()) { setError("Business type is required."); return; }
    setLoading(true);
    setError("");
    setResult("");
    setDone(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessType, customerSegments, subscriptionTiers, churnDrivers, healthMetrics }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Generation failed."); return; }
      setResult(data.result);
      setDone(true);
    } catch { setError("Failed to connect."); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950">
      <header className="border-b border-white/10 sticky top-0 z-10 bg-slate-950/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">❤️‍🔥</span>
          <div>
            <h1 className="text-xl font-bold text-white">AI Customer Health Score Calculator</h1>
            <p className="text-xs text-slate-400">CS strategy · Churn prevention · DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Predict Churn Before It Happens ❤️‍🔥</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">Build a data-driven health score system with weighted metrics, warning signals, and intervention playbooks.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🏢 Business Type *</label>
              <input value={businessType} onChange={(e) => setBusinessType(e.target.value)} placeholder="e.g. SaaS CRM, Project management tool, Data analytics platform"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">👥 Customer Segments</label>
              <input value={customerSegments} onChange={(e) => setCustomerSegments(e.target.value)} placeholder="e.g. SMB, Mid-Market, Enterprise, Freelancers"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">💳 Subscription Tiers</label>
              <input value={subscriptionTiers} onChange={(e) => setSubscriptionTiers(e.target.value)} placeholder="e.g. Free, Starter ($19), Pro ($49), Enterprise (custom)"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">⚠️ Known Churn Drivers</label>
              <input value={churnDrivers} onChange={(e) => setChurnDrivers(e.target.value)} placeholder="e.g. Low engagement, pricing, competitor, poor support"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-400" />
            </div>
            <div className="md:col-span-2">
              <label className="text-white font-semibold text-sm block mb-2">📊 Existing Health Metrics</label>
              <textarea value={healthMetrics} onChange={(e) => setHealthMetrics(e.target.value)} rows={2}
                placeholder="e.g. Login frequency, feature adoption, support tickets, NPS score, payment history..."
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none" />
            </div>
          </div>

          <button onClick={generate} disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2">
            {loading ? <><span className="animate-spin text-xl">⚙️</span> Calculating health scores...</> : <><span>❤️‍🔥</span> Build Health Score System</>}
          </button>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-5 py-3 text-red-300 text-sm">{error}</div>}

        {done && result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-rose-500/10 border-b border-rose-500/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">❤️‍🔥</span>
                <p className="text-rose-300 font-bold text-sm">Health Score System for: {businessType}</p>
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

        <p className="text-center text-xs text-slate-600">AI Customer Health Score Calculator · {new Date().getFullYear()} · DeepSeek</p>
      </div>
    </main>
  );
}
