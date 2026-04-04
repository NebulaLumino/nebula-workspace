"use client";

import { useState } from "react";

const PERSONALITIES = [
  { value: "confident", label: "💪 Confident", desc: "Bold and self-assured" },
  { value: "playful", label: "🎉 Playful", desc: "Fun and lighthearted" },
  { value: "witty", label: "🧠 Witty", desc: "Smart and clever" },
  { value: "charming", label: "✨ Charming", desc: "Smooth and charismatic" },
];

const HUMOR_LEVELS = [
  { value: "cheesy", label: "🧀 Cheesy", desc: "Corny but lovable" },
  { value: "clever", label: "🧠 Clever", desc: "Witty wordplay" },
  { value: "smooth", label: "😎 Smooth", desc: "Confident & understated" },
  { value: "funny", label: "😂 Funny", desc: "Laugh-out-loud humor" },
];

export default function Home() {
  const [personality, setPersonality] = useState("playful");
  const [context, setContext] = useState("");
  const [humorLevel, setHumorLevel] = useState("clever");
  const [count, setCount] = useState(15);
  const [lines, setLines] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState<Set<number>>(new Set());

  const generate = async () => {
    setLoading(true);
    setError(null);
    setLines([]);
    setLiked(new Set());

    try {
      const res = await fetch("/api/lines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personality, context, humorLevel, count }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      const parsed = data.lines
        .split(/(?=\n?\d+\.)/)
        .map((l: string) => l.replace(/^\d+\.\s*/, "").trim())
        .filter((l: string) => l.length > 5);

      setLines(parsed);
    } catch {
      setError("Failed to connect to the pickup lines service.");
    } finally {
      setLoading(false);
    }
  };

  const toggleLiked = (i: number) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const copyLine = (line: string) => {
    navigator.clipboard.writeText(line);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-red-100">
      <header className="bg-white/80 backdrop-blur-sm border-b border-rose-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">💘</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Pickup Lines Generator</h1>
            <p className="text-xs text-gray-400">Original, witty, never cringe · Powered by DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-gray-900">Break the ice, not the law 💘</h2>
          <p className="text-gray-500 text-sm">Generate original pickup lines tailored to your vibe.</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-rose-200 p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">🎭 Your Vibe</label>
              <div className="space-y-1.5">
                {PERSONALITIES.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPersonality(p.value)}
                    className={`w-full rounded-xl border px-3 py-2.5 text-left transition-all ${
                      personality === p.value
                        ? "border-rose-400 bg-rose-50 ring-1 ring-rose-400"
                        : "border-gray-200 hover:border-rose-200 bg-gray-50"
                    }`}
                  >
                    <div className={`text-xs font-bold ${personality === p.value ? "text-rose-700" : "text-gray-700"}`}>{p.label}</div>
                    <div className="text-xs text-gray-400">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">😂 Humor Level</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {HUMOR_LEVELS.map((h) => (
                    <button
                      key={h.value}
                      onClick={() => setHumorLevel(h.value)}
                      className={`rounded-xl border px-3 py-2 text-left transition-all ${
                        humorLevel === h.value
                          ? "border-rose-400 bg-rose-50 ring-1 ring-rose-400"
                          : "border-gray-200 hover:border-rose-200 bg-gray-50"
                      }`}
                    >
                      <div className={`text-xs font-bold ${humorLevel === h.value ? "text-rose-700" : "text-gray-700"}`}>{h.label}</div>
                      <div className="text-xs text-gray-400">{h.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">📍 Context (optional)</label>
                <input
                  type="text"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="e.g. Coffee shop, dating app, party..."
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">📊 Number of lines ({count})</label>
                <input
                  type="range"
                  min={5}
                  max={30}
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value))}
                  className="w-full accent-rose-500"
                />
              </div>
            </div>
          </div>

          <button
            onClick={generate}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⚙️</span>
                Generating lines...
              </>
            ) : (
              <>💘 Generate Pickup Lines</>
            )}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>
          )}
        </div>

        {/* Lines */}
        {lines.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-rose-200 overflow-hidden">
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-4">
              <h3 className="text-white font-bold text-sm">✨ {lines.length} Pickup Lines</h3>
            </div>
            <div className="p-4 space-y-2">
              {lines.map((line, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-gray-50 hover:bg-rose-50 rounded-xl px-4 py-3.5 border border-gray-100 group transition-all"
                >
                  <span className="text-rose-300 font-bold text-xs w-5 shrink-0 mt-0.5">{i + 1}</span>
                  <p className="text-sm text-gray-800 flex-1 leading-relaxed">{line}</p>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => toggleLiked(i)}
                      className={`text-xl transition-all ${liked.has(i) ? "scale-110" : "opacity-40 group-hover:opacity-80"}`}
                    >
                      {liked.has(i) ? "❤️" : "🤍"}
                    </button>
                    <button
                      onClick={() => copyLine(line)}
                      className="text-gray-300 hover:text-rose-400 text-sm ml-1"
                      title="Copy"
                    >
                      📋
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 pb-4">
          AI Pickup Lines Generator · {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
