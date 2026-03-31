"use client";
import { useState } from "react";

export default function ExitStrategyPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, type: "exit-strategy" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">🚀 AI Exit Strategy Planner</h1>
          <p className="text-gray-600 text-lg">Generate a strategic exit roadmap for your business</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Business & Exit Goals</label>
          <textarea
            className="w-full border border-gray-300 rounded-xl p-4 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
            rows={12}
            placeholder={`Describe your business and exit goals:\n\n1. Business Stage (pre-revenue, early, growth, mature):\n2. Current Revenue & Growth Rate:\n3. Industry/Sector:\n4. Team Size:\n5. Current Valuation (if known):\n6. Owner Goals:\n   - Timeline to exit:\n   - Desired outcome (wealth, legacy, succession):\n   - Role post-exit (stay, minimal involvement, leave):\n7. Any specific acquirers or exit paths you're considering:\n8. Key value drivers in your business:`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !input.trim()}
            className="mt-4 w-full bg-yellow-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "🔄 Building Exit Roadmap..." : "🚀 Generate Exit Strategy"}
          </button>
          {error && <p className="mt-3 text-red-600 text-sm">{error}</p>}
        </div>

        {result && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">✅ Exit Strategy Roadmap</h2>
            <pre className="bg-gray-50 rounded-xl p-4 text-sm overflow-x-auto whitespace-pre-wrap text-gray-800">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
