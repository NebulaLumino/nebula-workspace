"use client";

import { useState } from "react";

const FORTUNE_TYPES = [
  {
    value: "general",
    label: "🔮 General Fortune",
    desc: "Overall life direction and cosmic energy",
    emoji: "🔮",
  },
  {
    value: "love",
    label: "💕 Love Reading",
    desc: "Romance, connection, matters of the heart",
    emoji: "💕",
  },
  {
    value: "career",
    label: "💼 Career Fortune",
    desc: "Professional path and work decisions",
    emoji: "💼",
  },
  {
    value: "secret",
    label: "🗝️ The Secret",
    desc: "A hidden truth the universe wants you to know",
    emoji: "🗝️",
  },
];

const CARD_POSITIONS = [
  "The Past",
  "The Present",
  "The Hidden",
  "The Future",
];

export default function Home() {
  const [fortuneType, setFortuneType] = useState("general");
  const [question, setQuestion] = useState("");
  const [fortune, setFortune] = useState<string | null>(null);
  const [fortuneTitle, setFortuneTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drawnCards, setDrawnCards] = useState<string[]>([]);

  const drawCards = () => {
    const cardNames = [
      "The Mystic",
      "The Star",
      "The Moon",
      "The Sun",
      "The Wheel",
      "The Tower",
      "The Lovers",
      "The Hermit",
      "Justice",
      "Strength",
      "The Magician",
      "The High Priestess",
    ];
    const shuffled = [...cardNames].sort(() => Math.random() - 0.5);
    setDrawnCards(shuffled.slice(0, 4));
  };

  const generate = async () => {
    setLoading(true);
    setError(null);
    setFortune(null);
    setFortuneTitle(null);

    if (drawnCards.length === 0) drawCards();

    try {
      const res = await fetch("/api/fortune", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fortuneType, question }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setFortune(data.fortune);
      setFortuneTitle(data.title);
    } catch {
      setError("Failed to connect to the fortune service.");
    } finally {
      setLoading(false);
    }
  };

  const config = FORTUNE_TYPES.find((f) => f.value === fortuneType);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-950 via-slate-950 to-indigo-950">
      <header className="bg-white/5 border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">🔮</span>
          <div>
            <h1 className="text-xl font-bold text-white">AI Fortune Teller</h1>
            <p className="text-xs text-white/40">Divine your destiny · Powered by DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-white">The cards reveal... 🔮</h2>
          <p className="text-white/50 text-sm">Choose your fortune type and let the cosmos illuminate your path.</p>
        </div>

        {/* Fortune Type */}
        <div>
          <label className="block text-xs font-semibold text-white/60 mb-3">🃏 Choose Your Fortune</label>
          <div className="grid grid-cols-2 gap-3">
            {FORTUNE_TYPES.map((f) => (
              <button
                key={f.value}
                onClick={() => setFortuneType(f.value)}
                className={`rounded-2xl border p-4 text-left transition-all ${
                  fortuneType === f.value
                    ? "border-purple-400 bg-purple-600/30 ring-1 ring-purple-400"
                    : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                <div className="text-2xl mb-2">{f.emoji}</div>
                <div className={`text-sm font-bold ${fortuneType === f.value ? "text-white" : "text-white/70"}`}>{f.label.split(" ")[0]} {f.label.split(" ").slice(1).join(" ")}</div>
                <div className="text-xs text-white/40 mt-1">{f.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Question */}
        <div>
          <label className="block text-xs font-semibold text-white/60 mb-2">❓ Your Question (optional)</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What do you most need to know right now?"
            className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 text-sm text-white/80 placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
          />
        </div>

        {/* Draw Cards */}
        {drawnCards.length === 0 && (
          <div className="flex justify-center">
            <button
              onClick={drawCards}
              className="text-sm text-purple-300/60 hover:text-purple-300 underline underline-offset-4"
            >
              🎴 Draw 4 cards first (optional)
            </button>
          </div>
        )}

        {drawnCards.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <label className="block text-xs font-semibold text-white/60 mb-3">🎴 Your Cards Drawn</label>
            <div className="grid grid-cols-4 gap-3">
              {drawnCards.map((card, i) => (
                <div key={i} className="text-center">
                  <div className="w-full aspect-[2/3] rounded-xl bg-gradient-to-br from-purple-700 to-indigo-800 border border-purple-500/30 flex flex-col items-center justify-center p-1">
                    <span className="text-lg">{["🃏", "⭐", "🌙", "☀️", "🎡", "🗼", "💕", "🌑", "⚖️", "🦁", "🧙", "👁️"][i]}</span>
                    <span className="text-[10px] text-white/70 font-bold mt-1 leading-tight">{card}</span>
                  </div>
                  <span className="text-[10px] text-white/40 mt-1 block">{CARD_POSITIONS[i]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={generate}
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="animate-spin">⚙️</span>
              Consulting the cosmos...
            </>
          ) : (
            <>🔮 Divinate My Fortune</>
          )}
        </button>

        {error && (
          <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Fortune */}
        {fortune && (
          <div className="bg-white/5 border border-purple-500/30 rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex items-center gap-3">
              <span className="text-2xl">🔮</span>
              <div>
                <h3 className="text-white font-bold text-sm">{fortuneTitle}</h3>
                <p className="text-white/60 text-xs">The cards have spoken</p>
              </div>
            </div>
            <div className="px-6 py-5">
              <div
                className="text-white/85 whitespace-pre-wrap leading-relaxed text-sm"
                style={{ fontFamily: "Georgia, serif", fontSize: "0.95rem", lineHeight: "1.85" }}
              >
                {fortune}
              </div>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-white/20 pb-4">
          AI Fortune Teller · {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
