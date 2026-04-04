"use client";

import { useState } from "react";

const STYLES = [
  { value: "mixed", label: "🎲 Mixed", desc: "All kinds of jokes" },
  { value: "puns", label: "🪓 Puns", desc: "Wordplay & double meanings" },
  { value: "one liners", label: "⚡ One-liners", desc: "Short, punchy punches" },
  { value: "observational", label: "🔍 Observational", desc: "Everyday life humor" },
];

export default function Home() {
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("mixed");
  const [clean, setClean] = useState(true);
  const [count, setCount] = useState(10);
  const [jokes, setJokes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revealedIdx, setRevealedIdx] = useState<number[]>([]);

  const generate = async () => {
    setLoading(true);
    setError(null);
    setJokes([]);
    setRevealedIdx([]);

    try {
      const res = await fetch("/api/jokes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, style, clean, count }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      const parsed = data.jokes
        .split(/(?=\n?\d+\.)/)
        .map((j: string) => j.trim())
        .filter((j: string) => j.length > 5);

      setJokes(parsed);
    } catch {
      setError("Failed to connect to the joke service.");
    } finally {
      setLoading(false);
    }
  };

  const revealJoke = (i: number) => {
    setRevealedIdx((prev) =>
      prev.includes(i) ? prev.filter((idx) => idx !== i) : [...prev, i]
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-yellow-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">😂</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Joke Generator</h1>
            <p className="text-xs text-gray-400">Fresh jokes on demand · Powered by DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-gray-900">Need a laugh? 😂</h2>
          <p className="text-gray-500 text-sm">Pick a style and let AI crack you up.</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-yellow-100 p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">🎯 Topic (optional)</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g.程序员, cats, coffee, work from home... (leave blank for any)"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
            />
          </div>

          {/* Style */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">🎭 Joke Style</label>
            <div className="grid grid-cols-2 gap-2">
              {STYLES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStyle(s.value)}
                  className={`rounded-xl border px-3 py-2.5 text-left transition-all ${
                    style === s.value
                      ? "border-yellow-400 bg-yellow-50 ring-1 ring-yellow-400"
                      : "border-gray-200 hover:border-yellow-300 bg-gray-50"
                  }`}
                >
                  <div className={`text-xs font-bold ${style === s.value ? "text-yellow-700" : "text-gray-700"}`}>{s.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Clean toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={clean}
              onChange={(e) => setClean(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
            />
            <span className="text-sm text-gray-600">Family-friendly jokes only</span>
          </label>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">📊 Number of jokes ({count})</label>
            <input
              type="range"
              min={5}
              max={20}
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="w-full accent-yellow-500"
            />
          </div>

          <button
            onClick={generate}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 hover:from-yellow-500 hover:via-amber-500 hover:to-orange-500 text-gray-900 font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⚙️</span>
                Cooking up jokes...
              </>
            ) : (
              <>😂 Generate Jokes</>
            )}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        {/* Joke Cards */}
        {jokes.length > 0 && (
          <div className="space-y-3">
            {jokes.map((joke, i) => {
              const isRevealed = revealedIdx.includes(i);
              const labelMatch = joke.match(/^\[(.+?)\]\s*/);
              const label = labelMatch ? labelMatch[1] : null;
              const body = labelMatch ? joke.replace(labelMatch[0], "") : joke;

              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-sm border border-yellow-100 overflow-hidden"
                >
                  <div className="px-5 py-4 flex items-center gap-3">
                    <span className="text-2xl shrink-0">{label === "Pun" ? "🪓" : label === "One-liner" ? "⚡" : label === "Observational" ? "🔍" : "😂"}</span>
                    <div className="flex-1 min-w-0">
                      {label && (
                        <span className="text-xs font-bold text-yellow-600 uppercase tracking-wide">{label}</span>
                      )}
                      <p className="text-sm text-gray-800">{body}</p>
                    </div>
                    <button
                      onClick={() => revealJoke(i)}
                      className={`shrink-0 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                        isRevealed
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-500 hover:bg-yellow-100 hover:text-yellow-700"
                      }`}
                    >
                      {isRevealed ? "🙈 Hide" : "👀 Reveal"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-center text-xs text-gray-400 pb-4">
          AI Joke Generator · {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
