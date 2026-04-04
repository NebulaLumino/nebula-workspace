"use client";

import { useState } from "react";

const ACCENT = "text-violet-400";

export default function Home() {
  const [inputs, setInputs] = useState({
    topic: "",
    articleType: "news",
    tone: "informative",
    length: "medium",
  });
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputs.topic.trim()) return;
    setLoading(true);
    setOutput("");
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Generation failed"); return; }
      setOutput(data.article || "");
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className={`text-4xl font-bold ${ACCENT} mb-2`}>📰 AI News Article Generator</h1>
          <p className="text-gray-400 text-lg">Generate professional, well-structured news articles with AI</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Article Topic *</label>
              <textarea
                name="topic"
                value={inputs.topic}
                onChange={handleChange}
                placeholder="e.g. The impact of AI on local journalism in 2026..."
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Article Type</label>
              <select name="articleType" value={inputs.articleType} onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                <option value="news">Breaking News</option>
                <option value="feature">Feature Story</option>
                <option value="analysis">In-Depth Analysis</option>
                <option value="opinion">Opinion / Editorial</option>
                <option value="profile">Profile / Human Interest</option>
                <option value="investigation">Investigative Report</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Tone</label>
              <select name="tone" value={inputs.tone} onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                <option value="informative">Informative & Neutral</option>
                <option value="investigative">Investigative & Probing</option>
                <option value="conversational">Conversational & Engaging</option>
                <option value="formal">Formal & Authoritative</option>
                <option value="empathetic">Empathetic & Human Interest</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Length</label>
              <select name="length" value={inputs.length} onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                <option value="short">Short (~400 words)</option>
                <option value="medium">Medium (~800 words)</option>
                <option value="long">Long (~1200+ words)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${loading ? "bg-gray-700 cursor-not-allowed" : "bg-violet-600 hover:bg-violet-500"}`}
          >
            {loading ? "Generating Article..." : "✍️ Generate Article"}
          </button>
        </form>

        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-300 mb-6">
            {error}
          </div>
        )}

        {output && (
          <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
            <div className="bg-gray-800 px-6 py-3 border-b border-gray-700">
              <span className={`text-sm font-semibold ${ACCENT}`}>Generated Article</span>
            </div>
            <div className="p-6 prose prose-invert prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-gray-300 text-sm font-mono leading-relaxed bg-transparent p-0 m-0 border-0 shadow-none overflow-visible">{output}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
