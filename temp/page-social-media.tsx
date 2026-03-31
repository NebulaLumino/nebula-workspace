"use client";
import { useState } from "react";

export default function SocialMediaPage() {
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
        body: JSON.stringify({ input, type: "social-media" }),
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">🚨 AI Social Media Crisis Response</h1>
          <p className="text-gray-600 text-lg">Generate crisis response plans and approved messaging templates</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Crisis Details</label>
          <textarea
            className="w-full border border-gray-300 rounded-xl p-4 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
            rows={10}
            placeholder={`Describe the crisis:\n\n1. What happened (factual description):\n2. Which platform(s) is it trending on:\n3. Current sentiment (negative mentions, share of voice):\n4. Stakeholders affected (customers, employees, investors, media):\n5. Company values and brand voice:\n6. Any immediate actions already taken:\n7. Time sensitivity (how fast do you need to respond):`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !input.trim()}
            className="mt-4 w-full bg-red-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "🔄 Building Crisis Response..." : "🚨 Generate Crisis Response Plan"}
          </button>
          {error && <p className="mt-3 text-red-600 text-sm">{error}</p>}
        </div>

        {result && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">✅ Crisis Response Plan</h2>
            <pre className="bg-gray-50 rounded-xl p-4 text-sm overflow-x-auto whitespace-pre-wrap text-gray-800">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
