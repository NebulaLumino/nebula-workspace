"use client";

import { useState } from "react";

const STYLES = [
  { value: "free", label: "🌊 Free Verse", desc: "Modern, imagery-rich, no rules" },
  { value: "sonnet", label: "📜 Sonnet", desc: "14 lines, Shakespearean rhyme" },
  { value: "haiku", label: "🍃 Haiku", desc: "3 lines, 5-7-5 syllables" },
  { value: "limerick", label: "🎩 Limerick", desc: "Playful 5-line, AABBA rhyme" },
  { value: "ballad", label: "🎻 Ballad", desc: "Romantic, verse + chorus style" },
];

const MOODS = [
  "Contemplative",
  "Joyful",
  "Melancholic",
  "Romantic",
  "Mysterious",
  "Nostalgic",
  "Hopeful",
  "Bittersweet",
];

export default function Home() {
  const [theme, setTheme] = useState("");
  const [mood, setMood] = useState("Contemplative");
  const [style, setStyle] = useState("free");
  const [count, setCount] = useState(2);
  const [poetry, setPoetry] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const generate = async () => {
    if (!theme.trim()) {
      setError("Please enter a theme or topic.");
      return;
    }

    setLoading(true);
    setError(null);
    setPoetry([]);

    try {
      const res = await fetch("/api/poetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme, mood, style, count }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      const parsed = data.poetry
        .split(/\n---+\n/)
        .map((p: string) => p.trim())
        .filter((p: string) => p.length > 0);

      setPoetry(parsed);
    } catch {
      setError("Failed to connect to the poetry service.");
    } finally {
      setLoading(false);
    }
  };

  const copyPoem = (poem: string, i: number) => {
    navigator.clipboard.writeText(poem);
    setCopiedIdx(i);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-slate-100">
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">📖</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Poetry Generator</h1>
            <p className="text-xs text-gray-400">Original verse in any form · Powered by DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-gray-900">Where language becomes art ✨</h2>
          <p className="text-gray-500 text-sm">Enter a theme and let AI compose original poetry in classic and modern forms.</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🎨 Theme / Topic <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="e.g. The ocean at midnight, First love, Lost time, The color blue..."
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">🎭 Mood</label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
              >
                {MOODS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">📐 Poetic Form</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
              >
                {STYLES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label.split(" ")[1]} — {s.desc}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">📊 Number of poems ({count})</label>
            <input
              type="range"
              min={1}
              max={4}
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>

          <button
            onClick={generate}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⚙️</span>
                Composing poetry...
              </>
            ) : (
              <>📖 Generate Poetry</>
            )}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        {/* Poetry Cards */}
        {poetry.length > 0 && (
          <div className="space-y-4">
            {poetry.map((poem, i) => {
              const lines = poem.split("\n");
              const title = lines[0]?.replace(/^#+\s*/, "").trim() || `Poem ${i + 1}`;
              const body = lines.slice(1).join("\n").trim();

              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-3 flex items-center justify-between">
                    <h3 className="text-white font-bold text-sm">✒️ {title}</h3>
                    <button
                      onClick={() => copyPoem(poem, i)}
                      className="text-xs text-white/90 hover:text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-all"
                    >
                      {copiedIdx === i ? "✅ Copied!" : "📋 Copy"}
                    </button>
                  </div>
                  <div className="px-6 py-5">
                    <pre
                      className="text-gray-700 whitespace-pre-wrap leading-loose"
                      style={{ fontFamily: "Georgia, serif", fontSize: "1rem", lineHeight: "1.9" }}
                    >
                      {body}
                    </pre>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-center text-xs text-gray-400 pb-4">
          AI Poetry Generator · {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
