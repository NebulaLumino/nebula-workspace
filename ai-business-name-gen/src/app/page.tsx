"use client";

import { useState } from "react";

const VIBES = [
  "Professional & Trustworthy", "Fun & Playful", "Bold & Innovative",
  "Minimalist & Clean", "Warm & Friendly", "Luxury & Premium", "Eco & Natural"
];

export default function Home() {
  const [form, setForm] = useState({
    businessIdea: "",
    industry: "",
    vibe: "",
    includeDomain: true,
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const generate = async () => {
    if (!form.businessIdea.trim()) {
      setError("Please describe your business idea.");
      return;
    }
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setResult(data.result);
    } catch {
      setError("Failed to connect to the naming service.");
    } finally {
      setLoading(false);
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatResult = (text: string) => {
    return text
      .replace(/## /g, '<h2 style="color:#1d4ed8;font-weight:800;font-size:0.95rem;margin-top:24px;margin-bottom:12px;padding-bottom:6px;border-bottom:2px solid #dbeafe">')
      .replace(/\*\*(Name|Tagline|Why it works|Domain idea)\*\*/g, '<strong style="color:#1e40af">$1:</strong>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">🚀</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Small Business Name Generator</h1>
            <p className="text-xs text-gray-400">Names, taglines & domain hints · Powered by DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="text-center mb-10 space-y-1">
          <h2 className="text-4xl font-extrabold text-gray-900">
            Name your business in seconds 🚀
          </h2>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">
            Describe what you're building — get 10 unique name ideas with taglines and domain availability hints.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 space-y-5">
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Your Business</h3>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">What are you building? *</label>
              <textarea
                name="businessIdea"
                value={form.businessIdea}
                onChange={handleChange}
                placeholder="e.g. A mobile app that helps freelancers track invoices and expenses..."
                rows={4}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Industry / Niche</label>
              <input
                type="text"
                name="industry"
                value={form.industry}
                onChange={handleChange}
                placeholder="e.g. SaaS, Food & Beverage, Consulting, E-commerce..."
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Brand Vibe</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {VIBES.map((v) => (
                  <button
                    key={v}
                    onClick={() => setForm((prev) => ({ ...prev, vibe: prev.vibe === v ? "" : v }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      form.vibe === v
                        ? "bg-blue-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="includeDomain"
                checked={form.includeDomain}
                onChange={handleChange}
                className="w-4 h-4 accent-blue-500"
              />
              <label className="text-xs text-gray-600">Include domain availability hints</label>
            </div>

            <button
              onClick={generate}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span><span className="animate-spin">⚙️</span> Generating names...</span>
              ) : (
                <span>🚀 Generate Business Names</span>
              )}
            </button>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}
          </div>

          {/* Output */}
          <div>
            {result ? (
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden h-full">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4 flex items-center justify-between">
                  <h3 className="text-white font-bold text-sm">🚀 Business Name Ideas</h3>
                  <button
                    onClick={copyResult}
                    className="text-xs text-white/90 hover:text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-all"
                  >
                    {copied ? "✅ Copied!" : "📋 Copy"}
                  </button>
                </div>
                <div className="px-6 py-5 overflow-y-auto max-h-[70vh]">
                  <div
                    className="text-gray-700 text-sm"
                    style={{ fontSize: "0.88rem", lineHeight: "1.85" }}
                    dangerouslySetInnerHTML={{ __html: formatResult(result) }}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 text-center h-full flex flex-col justify-center items-center">
                <span className="text-5xl mb-4">🚀</span>
                <p className="text-base font-medium text-gray-500">No names yet</p>
                <p className="text-xs text-gray-400 mt-1">Describe your business and click Generate</p>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-10 pb-4">
          AI Small Business Name Generator · {new Date().getFullYear()} · Check domain availability before registering
        </p>
      </div>
    </main>
  );
}
