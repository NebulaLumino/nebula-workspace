"use client";

import { useState } from "react";

const ACCENT: [number, number, number] = [300, 70, 60];
const accentStyle = { color: `hsl(${ACCENT[0]}, ${ACCENT[1]}%, ${ACCENT[2]}%)` };
const accentBg = { backgroundColor: `hsl(${ACCENT[0]}, ${ACCENT[1]}%, ${ACCENT[2]}%)` };
const accentRing = { "--tw-ring-color": `hsl(${ACCENT[0]}, ${ACCENT[1]}%, ${ACCENT[2]}%)` } as React.CSSProperties;

export default function ConferenceAbstractPage() {
  const [researchSummary, setResearchSummary] = useState("");
  const [conference, setConference] = useState("");
  const [wordLimit, setWordLimit] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ researchSummary, conference, wordLimit }),
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-gray-100">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6" style={accentBg}>
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-3">Conference Abstract Builder & Submission Optimizer</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Generate a polished, word-limit-optimized conference abstract tailored to your target conference and reviewers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mb-10">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="researchSummary">
              Research Summary <span style={accentStyle}>*</span>
            </label>
            <textarea
              id="researchSummary"
              value={researchSummary}
              onChange={(e) => setResearchSummary(e.target.value)}
              placeholder="Describe your research: what was studied, what methods were used, key findings, and main conclusion..."
              required
              rows={5}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-opacity-60 transition-all resize-none"
              style={accentRing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="conference">
              Target Conference <span className="text-gray-500 font-normal">(optional)</span>
            </label>
            <input
              id="conference"
              type="text"
              value={conference}
              onChange={(e) => setConference(e.target.value)}
              placeholder="e.g., NeurIPS, ASCO Annual Meeting, AGU Fall Meeting, CROI, AAAI Conference"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-opacity-60 transition-all"
              style={accentRing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="wordLimit">
              Word Limit <span className="text-gray-500 font-normal">(optional)</span>
            </label>
            <input
              id="wordLimit"
              type="number"
              value={wordLimit}
              onChange={(e) => setWordLimit(e.target.value)}
              placeholder="e.g., 300, 500 (leave blank for 250-word default)"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-opacity-60 transition-all"
              style={accentRing}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:brightness-110 active:brightness-95"
            style={accentBg}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Optimizing Abstract...
              </span>
            ) : (
              "Generate Optimized Abstract"
            )}
          </button>
        </form>

        {error && (
          <div className="mb-8 p-4 bg-red-900/30 border border-red-800 rounded-xl text-red-300 text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="bg-gray-800/60 border border-gray-700 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={accentBg} />
              <span className="text-sm font-medium text-gray-300">Optimized Conference Abstract</span>
            </div>
            <div className="p-6">
              <div className="text-gray-200 whitespace-pre-wrap leading-relaxed">{result}</div>
            </div>
          </div>
        )}

        <p className="text-center text-gray-600 text-xs mt-10">
          AI-generated abstract for conference preparation. Always review and adapt for your specific submission requirements.
        </p>
      </div>
    </div>
  );
}
