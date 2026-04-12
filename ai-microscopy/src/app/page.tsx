"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setOutput("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      setOutput(data.output || "No response generated.");
    } catch {
      setOutput("Error: Failed to generate response.");
    } finally {
      setLoading(false);
    }
  };

  const bgColor = "hsl(200deg,45%,45%)";

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-2 text-center" style={{ color: bgColor }}>
          Microscopy Technique Selector
        </h1>
        <p className="text-gray-400 text-center mb-8 text-sm">
          AI-powered scientific tool — provide your input and let the AI assist.
        </p>
        <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-6 mb-6 backdrop-blur-sm">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Input
          </label>
          <textarea
            className="w-full bg-gray-900/80 border border-gray-600 rounded-lg p-3 text-white text-sm resize-y focus:outline-none focus:ring-2"
            style={{ "--tw-ring-color": bgColor }}
            rows={6}
            placeholder={"Enter sample type and research question to determine optimal microscopy technique..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !input.trim()}
            className="mt-4 w-full py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: bgColor }}
          >
            {loading ? "Processing..." : "Select Technique"}
          </button>
        </div>
        {output && (
          <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">Results</h2>
            <div className="prose prose-invert prose-sm max-w-none text-gray-200 whitespace-pre-wrap">
              {output}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
