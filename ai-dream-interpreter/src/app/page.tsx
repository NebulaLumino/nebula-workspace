"use client";

import { useState } from "react";

const EXAMPLE_DREAMS = [
  "Being chased by something in the dark",
  "Flying over a city without instructions",
  "An ex-partner who says nothing",
  "Showing up somewhere with no clothes on",
  "A door that leads somewhere impossible",
  "A deceased relative who feels alive",
];

export default function Home() {
  const [dream, setDream] = useState("");
  const [context, setContext] = useState("");
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (!dream.trim()) {
      setError("Please describe your dream.");
      return;
    }

    setLoading(true);
    setError(null);
    setInterpretation(null);

    try {
      const res = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dream, context }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setInterpretation(data.interpretation);
    } catch {
      setError("Failed to connect to the dream service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
      <header className="bg-white/5 border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">🌙</span>
          <div>
            <h1 className="text-xl font-bold text-white">AI Dream Interpreter</h1>
            <p className="text-xs text-white/40">Uncover the meaning · Powered by DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-white">What does your dream mean? 🌙</h2>
          <p className="text-white/50 text-sm">Describe your dream and let the subconscious speak.</p>
        </div>

        {/* Form */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-white/70 mb-2">
              🌙 Describe your dream <span className="text-purple-400">*</span>
            </label>
            <textarea
              value={dream}
              onChange={(e) => setDream(e.target.value)}
              placeholder="I was walking through a forest and suddenly the trees turned into people I used to know..."
              rows={5}
              className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 text-sm text-white/80 placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/50 mb-2">💭 Recent events or emotions (optional context)</label>
            <input
              type="text"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g. Going through a breakup, feeling anxious about work..."
              className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-sm text-white/80 placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            />
          </div>

          {/* Examples */}
          <div>
            <label className="block text-xs font-semibold text-white/40 mb-2">💡 Try an example:</label>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_DREAMS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDream(d)}
                  className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white/70 transition-all"
                >
                  "{d.length > 30 ? d.slice(0, 30) + "..." : d}"
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generate}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⚙️</span>
                Interpreting your dream...
              </>
            ) : (
              <>🌙 Interpret My Dream</>
            )}
          </button>

          {error && (
            <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}
        </div>

        {/* Interpretation */}
        {interpretation && (
          <div className="bg-white/5 border border-purple-500/30 rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
              <h3 className="text-white font-bold text-sm">✨ Your Dream Interpretation</h3>
            </div>
            <div className="px-6 py-5">
              <div
                className="text-white/85 whitespace-pre-wrap leading-relaxed text-sm"
                style={{ fontFamily: "Georgia, serif", fontSize: "0.95rem", lineHeight: "1.85" }}
              >
                {interpretation}
              </div>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-white/20 pb-4">
          AI Dream Interpreter · {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
