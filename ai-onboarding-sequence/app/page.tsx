"use client";

import { useState } from "react";

function renderMarkdown(text: string) {
  return text.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      return <h3 key={i} className="text-base font-bold text-violet-300 mt-6 mb-2">{trimmed.replace(/\*\*/g, "")}</h3>;
    }
    if (trimmed.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-white mt-8 mb-3">{trimmed.replace("## ","")}</h2>;
    if (trimmed.startsWith("- ")) return <li key={i} className="text-slate-300 text-sm ml-4 mb-1 list-disc">{trimmed.replace("- ","")}</li>;
    if (/^\d+\.\s/.test(trimmed)) return <li key={i} className="text-slate-300 text-sm ml-4 mb-1">{trimmed}</li>;
    if (trimmed === "") return <div key={i} className="h-2" />;
    return <p key={i} className="text-slate-300 text-sm leading-relaxed mb-1">{trimmed}</p>;
  });
}

export default function Home() {
  const [product, setProduct] = useState("");
  const [journey, setJourney] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product.trim()) return;
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, journey }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult(data.result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const accentRgb = "139, 92, 246";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-3" style={{ color: `rgb(${accentRgb})` }}>
            Onboarding Email Sequence Generator
          </h1>
          <p className="text-slate-400 text-lg">
            Generate a welcome onboarding email sequence with activation milestones and engagement tips.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mb-12">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">SaaS Product *</label>
            <textarea
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="Describe your SaaS product: what it does, what the main value is, and what the key activation moment is..."
              rows={4}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">User Journey Description (optional)</label>
            <textarea
              value={journey}
              onChange={(e) => setJourney(e.target.value)}
              placeholder="Describe your typical user journey and where they come from (signup, trial, freemium, etc.)"
              rows={2}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: `rgb(${accentRgb})` }}
          >
            {loading ? "Generating Sequence..." : "Generate Onboarding Sequence"}
          </button>
        </form>

        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 mb-8 text-red-300 text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="bg-gray-900/60 border border-gray-700 rounded-2xl p-8">
            <div className="space-y-1">{renderMarkdown(result)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
