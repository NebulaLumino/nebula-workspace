"use client";
import { useState } from "react";

export default function ContentCalendarPage() {
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
        body: JSON.stringify({ input, type: "content-calendar" }),
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">📅 AI Content Calendar Generator</h1>
          <p className="text-gray-600 text-lg">Generate a 30/60/90-day content calendar from your business goals</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Business & Content Goals</label>
          <textarea
            className="w-full border border-gray-300 rounded-xl p-4 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
            rows={10}
            placeholder={`Describe your content planning inputs:\n\n1. Business Type / Industry:\n2. Target Audience (demographics, interests, pain points):\n3. Marketing Goals (brand awareness, lead gen, retention, etc.):\n4. Content Themes / Topics to cover:\n5. Platforms to focus on (LinkedIn, Instagram, Blog, YouTube, etc.):\n6. Preferred calendar duration (30/60/90 days):\n7. Any seasonal events or campaigns coming up:`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !input.trim()}
            className="mt-4 w-full bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "🔄 Generating Calendar..." : "🚀 Generate Content Calendar"}
          </button>
          {error && <p className="mt-3 text-red-600 text-sm">{error}</p>}
        </div>

        {result && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">✅ Your Content Calendar</h2>
            <pre className="bg-gray-50 rounded-xl p-4 text-sm overflow-x-auto whitespace-pre-wrap text-gray-800">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
