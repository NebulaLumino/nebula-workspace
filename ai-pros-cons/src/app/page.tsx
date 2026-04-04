"use client";

import { useState } from "react";

const PERSPECTIVES = [
  { value: "first", label: "First-person (I/We)" },
  { value: "third", label: "Neutral third-party" },
];

const EXAMPLE_DECISIONS = [
  "Should I take the job offer in another city?",
  "Should we launch the product in Q2 or wait?",
  "Should I go back to graduate school?",
  "Should we hire a second developer now?",
];

export default function Home() {
  const [decision, setDecision] = useState("");
  const [context, setContext] = useState("");
  const [perspective, setPerspective] = useState("first");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!decision.trim()) {
      setError("Please describe the decision you're facing.");
      return;
    }
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision,
          context,
          perspective: perspective === "first" ? "First-person" : "Neutral third-party",
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); return; }
      setResult(data.result);
    } catch {
      setError("Failed to connect to the analysis service.");
    } finally {
      setLoading(false);
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatResult = (text: string) =>
    text
      .replace(/## ⚖️ Decision Overview/g, '<h2 style="color:#1e40af;font-weight:800;font-size:0.95rem;margin-top:24px;margin-bottom:12px;padding-bottom:6px;border-bottom:2px solid #dbeafe">⚖️ Decision Overview</h2>')
      .replace(/## ✅ Pros/g, '<h2 style="color:#15803d;font-weight:800;font-size:0.95rem;margin-top:22px;margin-bottom:12px;padding-bottom:6px;border-bottom:2px solid #dcfce7">✅ Pros</h2>')
      .replace(/## ❌ Cons/g, '<h2 style="color:#dc2626;font-weight:800;font-size:0.95rem;margin-top:22px;margin-bottom:12px;padding-bottom:6px;border-bottom:2px solid #fee2e2">❌ Cons</h2>')
      .replace(/## 🔍 Key Factors/g, '<h2 style="color:#7c3aed;font-weight:800;font-size:0.95rem;margin-top:22px;margin-bottom:12px;padding-bottom:6px;border-bottom:2px solid #ede9fe">🔍 Key Factors to Consider</h2>')
      .replace(/## 🎯 Weighted Recommendation/g, '<h2 style="color:#b45309;font-weight:800;font-size:0.95rem;margin-top:22px;margin-bottom:12px;padding-bottom:6px;border-bottom:2px solid #fef3c7">🎯 Weighted Recommendation</h2>')
      .replace(/## 🤔 Questions to Ask/g, '<h2 style="color:#0369a1;font-weight:800;font-size:0.95rem;margin-top:22px;margin-bottom:12px;padding-bottom:6px;border-bottom:2px solid #e0f2fe">🤔 Questions to Ask Yourself</h2>')
      .replace(/\n/g, '<br/>');

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-zinc-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">⚖️</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Pros & Cons Analyzer</h1>
            <p className="text-xs text-gray-400">Make better decisions with structured analysis · Powered by DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="text-center mb-10 space-y-1">
          <h2 className="text-4xl font-extrabold text-gray-900">Make better decisions, clearly ⚖️</h2>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">
            Describe a decision you're facing — get a thorough pros/cons analysis, key factors, weighted recommendation, and questions to ask yourself.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 space-y-5">
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Your Decision</h3>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">What are you deciding? *</label>
              <textarea
                value={decision}
                onChange={(e) => setDecision(e.target.value)}
                placeholder="e.g. Should I take the job offer in Seattle? Should we launch the beta in March?"
                rows={4}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent resize-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Quick Examples</label>
              <div className="space-y-1.5">
                {EXAMPLE_DECISIONS.map((ex) => (
                  <button key={ex} onClick={() => setDecision(ex)}
                    className="w-full text-left text-xs text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg px-3 py-2 transition-all">
                    → {ex}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Context / Background</label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Any additional context — your current situation, constraints, timeline, who's involved..."
                rows={3}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent resize-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Perspective</label>
              <div className="flex gap-3">
                {PERSPECTIVES.map((p) => (
                  <button key={p.value} onClick={() => setPerspective(p.value)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-all ${perspective === p.value ? "bg-slate-700 text-white shadow" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={generate} disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? (
                <span><span className="animate-spin">⚙️</span> Analyzing...</span>
              ) : (
                <span>⚖️ Analyze Pros & Cons</span>
              )}
            </button>

            {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>}
          </div>

          {/* Output */}
          <div>
            {result ? (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden h-full">
                <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-6 py-4 flex items-center justify-between">
                  <h3 className="text-white font-bold text-sm">⚖️ Analysis</h3>
                  <button onClick={copyResult}
                    className="text-xs text-white/90 hover:text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-all">
                    {copied ? "✅ Copied!" : "📋 Copy"}
                  </button>
                </div>
                <div className="px-6 py-5 overflow-y-auto max-h-[70vh]">
                  <div className="text-gray-700 text-sm" style={{ fontSize: "0.88rem", lineHeight: "1.85" }}
                    dangerouslySetInnerHTML={{ __html: formatResult(result) }} />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 text-center h-full flex flex-col justify-center items-center">
                <span className="text-5xl mb-4">⚖️</span>
                <p className="text-base font-medium text-gray-500">No analysis yet</p>
                <p className="text-xs text-gray-400 mt-1">Describe your decision and click Analyze</p>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-10 pb-4">AI Pros & Cons Analyzer · {new Date().getFullYear()} · Decisions are yours — so are the consequences</p>
      </div>
    </main>
  );
}
