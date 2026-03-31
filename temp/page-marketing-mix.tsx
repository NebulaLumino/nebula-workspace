"use client";
import { useState } from "react";

export default function MarketingMixPage() {
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
        body: JSON.stringify({ input, type: "marketing-mix" }),
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">📊 AI Marketing Mix Optimizer</h1>
          <p className="text-gray-600 text-lg">Enter your marketing data and get optimal budget allocation recommendations</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Marketing Data</label>
          <textarea
            className="w-full border border-gray-300 rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            rows={10}
            placeholder={`Paste your marketing data. Include:\n- Monthly spend by channel (Paid Search, Social, Email, Display, Affiliate, etc.)\n- Revenue attributed to each channel\n- Customer LTV if known\n- Time period covered\n\nExample:\nChannel | Spend | Revenue\nPaid Search | $5,000 | $25,000\nFacebook Ads | $3,000 | $12,000\nEmail | $500 | $8,000\nDisplay | $2,000 | $4,000`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !input.trim()}
            className="mt-4 w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "🔄 Generating Optimized Mix..." : "🚀 Generate Marketing Mix"}
          </button>
          {error && <p className="mt-3 text-red-600 text-sm">{error}</p>}
        </div>

        {result && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">✅ Optimized Marketing Mix</h2>
            <div className="prose prose-indigo max-w-none">
              <pre className="bg-gray-50 rounded-xl p-4 text-sm overflow-x-auto whitespace-pre-wrap text-gray-800">{result}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
