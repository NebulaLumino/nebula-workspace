"use client";

import { useState } from "react";

function renderMarkdown(text: string) {
  return text.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      return <h3 key={i} className="text-base font-bold text-teal-300 mt-6 mb-2">{trimmed.replace(/\*\*/g, "")}</h3>;
    }
    if (trimmed.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-white mt-8 mb-3">{trimmed.replace("## ","")}</h2>;
    if (trimmed.startsWith("- ")) return <li key={i} className="text-slate-300 text-sm ml-4 mb-1 list-disc">{trimmed.replace("- ","")}</li>;
    if (/^\d+\.\s/.test(trimmed)) return <li key={i} className="text-slate-300 text-sm ml-4 mb-1">{trimmed}</li>;
    if (trimmed === "") return <div key={i} className="h-2" />;
    return <p key={i} className="text-slate-300 text-sm leading-relaxed mb-1">{trimmed}</p>;
  });
}

export default function Home() {
  const [vision, setVision] = useState("");
  const [constraints, setConstraints] = useState("");
  const [team, setTeam] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vision.trim()) return;
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vision, constraints, team }),
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

  const accentRgb = "20, 184, 166";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-3" style={{ color: `rgb(${accentRgb})` }}>
            MVP Feature Prioritizer & Scope Planner
          </h1>
          <p className="text-slate-400 text-lg">
            Generate a prioritized MVP feature list with MoSCoW scoring and realistic scope estimates.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mb-12">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Product Vision *</label>
            <textarea
              value={vision}
              onChange={(e) => setVision(e.target.value)}
              placeholder="Describe the product vision: what problem it solves, who it's for, and what the core experience should be..."
              rows={4}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors resize-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Constraints (time, budget, tech)</label>
            <input
              type="text"
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              placeholder="e.g. 3-month timeline, $50K budget, must use existing tech stack"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Team Size & Skills</label>
            <input
              type="text"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              placeholder="e.g. 2 developers, 1 designer, React + Node.js expertise"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: `rgb(${accentRgb})` }}
          >
            {loading ? "Planning MVP Scope..." : "Generate MVP Scope Plan"}
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
