"use client";

import { useState } from "react";

export default function Home() {
  const [company, setCompany] = useState("");
  const [context, setContext] = useState("");
  const [length, setLength] = useState("Medium");
  const [audience, setAudience] = useState("General business audience");
  const [tone, setTone] = useState("Professional");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCopy, setShowCopy] = useState(false);

  const handleGenerate = async () => {
    if (!company.trim()) {
      setError("Please enter a company or topic name.");
      return;
    }
    setLoading(true);
    setError("");
    setSummary("");
    setShowCopy(false);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, context, length, audience, tone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setSummary(data.summary);
      setShowCopy(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary).then(() => {
      const btn = document.getElementById("copy-btn");
      if (btn) {
        btn.textContent = "✓ Copied!";
        setTimeout(() => (btn.textContent = "Copy to Clipboard"), 2000);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-sm">ES</div>
          <h1 className="font-bold text-lg">Executive Summary Generator</h1>
        </div>
        <span className="text-xs text-slate-400">AI-Powered · Powered by DeepSeek</span>
      </header>

      {/* Hero */}
      <div className="px-6 pt-10 pb-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          AI Executive Summary Generator
        </h2>
        <p className="text-slate-400 text-base max-w-lg mx-auto">
          Generate polished, professional executive summaries in seconds. Enter your company or topic below.
        </p>
      </div>

      {/* Form */}
      <div className="px-6 max-w-3xl mx-auto w-full flex-1 pb-10">
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 space-y-5">

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Company / Topic <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Acme Corp, Q3 Performance Review, Product Launch Plan"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Context */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Additional Context
            </label>
            <textarea
              placeholder="Describe the background, goals, challenges, or key data points you want included..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={4}
              className="w-full bg-slate-900/80 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Options Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Length */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Length</label>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
              >
                <option value="Concise">Concise (~150 words)</option>
                <option value="Medium">Medium (~300 words)</option>
                <option value="Detailed">Detailed (~500 words)</option>
              </select>
            </div>

            {/* Audience */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Audience</label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
              >
                <option>General business audience</option>
                <option>Board of Directors</option>
                <option>Investors / VCs</option>
                <option>Senior Executives</option>
                <option>Technical Team</option>
                <option>Clients / Customers</option>
              </select>
            </div>

            {/* Tone */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
              >
                <option>Professional</option>
                <option>Formal</option>
                <option>Persuasive</option>
                <option>Analytical</option>
                <option>Inspirational</option>
                <option>Plain English</option>
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="animate-spin">⟳</span>
                Generating Summary...
              </>
            ) : (
              <>
                <span>⚡</span> Generate Executive Summary
              </>
            )}
          </button>

          {/* Error */}
          {error && (
            <div className="bg-red-900/30 border border-red-700/50 rounded-xl px-4 py-3 text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Output */}
          {summary && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-300">Generated Summary</h3>
                <button
                  id="copy-btn"
                  onClick={copyToClipboard}
                  className="text-xs text-blue-400 hover:text-blue-300 border border-blue-500/40 hover:border-blue-400/60 rounded-lg px-3 py-1.5 transition-all cursor-pointer bg-blue-500/10"
                >
                  Copy to Clipboard
                </button>
              </div>
              <div className="bg-slate-900/90 border border-slate-600 rounded-xl px-5 py-4 text-sm text-slate-200 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                {summary}
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-slate-500 text-xs mt-5">
          Perfect for investors, board meetings, proposals, and strategic documents
        </p>
      </div>
    </div>
  );
}
