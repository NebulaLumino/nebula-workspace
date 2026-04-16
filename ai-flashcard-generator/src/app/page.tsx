"use client";

import { useState } from "react";

export default function Home() {
  const [inputs, setInputs] = useState<Record<string, string>>({
    "topic": "",
    "count": "20",
    "difficulty": "intermediate",
    "includeImages": "false",
  });
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key: string, value: string) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const buildPrompt = () => {
    return `Create ${inputs["count"]} flashcards about ${inputs["topic"]} at ${inputs["difficulty"]} difficulty. For each flashcard include the term/concept on the front and a clear explanation with memory cue on the back. Format as: Q: [term] | A: [explanation]. Include images: ${inputs["includeImages"]}.`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOutput("");

    try {
      const prompt = buildPrompt();
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setOutput(data.result || "No output received.");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-indigo-400 mb-3">Flashcard Generator</h1>
          <p className="text-gray-400 text-lg">Create effective flashcards for any subject with smart spacing and memory cues.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-200">Input</h2>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Topic</label>
                <input type="text" value={inputs["topic"] || ""} onChange={(e) => handleChange("topic", e.target.value)} placeholder="e.g. World War II History" className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Number of Cards</label>
                <input type="number" value={inputs["count"] || ""} onChange={(e) => handleChange("count", e.target.value)} placeholder="20" className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Difficulty</label>
                <select value={inputs["difficulty"] || ""} onChange={(e) => handleChange("difficulty", e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 ring-indigo-500">
                  <option value="">Select...</option>
                  <option value="beginner">beginner</option>
                  <option value="intermediate">intermediate</option>
                  <option value="advanced">advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Include Images</label>
                <select value={inputs["includeImages"] || ""} onChange={(e) => handleChange("includeImages", e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 ring-indigo-500">
                  <option value="">Select...</option>
                  <option value="true">true</option>
                  <option value="false">false</option>
                </select>
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 px-6 rounded-lg font-semibold text-white transition-all bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Generating..." : "Generate"}
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {error && (
              <div className="bg-red-900/30 border border-red-700 rounded-xl p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-200 mb-4">Output</h2>
              {output ? (
                <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-wrap">{output}</div>
              ) : (
                <p className="text-gray-500 italic">Your generated flashcards will appear here.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
