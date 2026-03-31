"use client";
import { useState } from "react";

export default function InvestorTermPage() {
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
        body: JSON.stringify({ input, type: "investor-term" }),
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">📄 AI Investor Term Sheet Generator</h1>
          <p className="text-gray-600 text-lg">Generate startup term sheets for your fundraising round</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Fundraising Details</label>
          <textarea
            className="w-full border border-gray-300 rounded-xl p-4 text-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all"
            rows={10}
            placeholder={`Provide your fundraising details:\n\n1. Round: (Seed, Series A, B, etc.)\n2. Round Size (target amount):\n3. Pre-money Valuation:\n4. Investor Type (VC, Angel, Corporate VC, Family Office):\n5. Lead Investor Name (if known):\n6. Your term preferences (e.g., founder-friendly, standard, aggressive):\n7. Current cap table (briefly):\n8. Any existing investor rights or preferences:\n9. Board composition (current vs. proposed):`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !input.trim()}
            className="mt-4 w-full bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "🔄 Drafting Term Sheet..." : "📝 Generate Term Sheet"}
          </button>
          {error && <p className="mt-3 text-red-600 text-sm">{error}</p>}
        </div>

        {result && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">✅ Draft Term Sheet</h2>
            <pre className="bg-gray-50 rounded-xl p-4 text-sm overflow-x-auto whitespace-pre-wrap text-gray-800">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
