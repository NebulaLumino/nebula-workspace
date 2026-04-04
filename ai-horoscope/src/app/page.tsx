"use client";

import { useState } from "react";

const ZODIAC_SIGNS = [
  { sign: "Aries", emoji: "♈", dates: "Mar 21 – Apr 19", element: "Fire" },
  { sign: "Taurus", emoji: "♉", dates: "Apr 20 – May 20", element: "Earth" },
  { sign: "Gemini", emoji: "♊", dates: "May 21 – Jun 20", element: "Air" },
  { sign: "Cancer", emoji: "♋", dates: "Jun 21 – Jul 22", element: "Water" },
  { sign: "Leo", emoji: "♌", dates: "Jul 23 – Aug 22", element: "Fire" },
  { sign: "Virgo", emoji: "♍", dates: "Aug 23 – Sep 22", element: "Earth" },
  { sign: "Libra", emoji: "♎", dates: "Sep 23 – Oct 22", element: "Air" },
  { sign: "Scorpio", emoji: "♏", dates: "Oct 23 – Nov 21", element: "Water" },
  { sign: "Sagittarius", emoji: "♐", dates: "Nov 22 – Dec 21", element: "Fire" },
  { sign: "Capricorn", emoji: "♑", dates: "Dec 22 – Jan 19", element: "Earth" },
  { sign: "Aquarius", emoji: "♒", dates: "Jan 20 – Feb 18", element: "Air" },
  { sign: "Pisces", emoji: "♓", dates: "Feb 19 – Mar 20", element: "Water" },
];

const PERIODS = [
  { value: "daily", label: "Daily", desc: "Today's cosmic forecast" },
  { value: "weekly", label: "Weekly", desc: "This week's full reading" },
  { value: "monthly", label: "Monthly", desc: "The month ahead" },
];

const FOCUS_AREAS = [
  { value: "all", label: "✨ All Areas" },
  { value: "love", label: "💕 Love & Relationships" },
  { value: "career", label: "💼 Career & Ambition" },
  { value: "health", label: "💪 Health & Wellness" },
  { value: "finances", label: "💰 Finances & Growth" },
];

export default function Home() {
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [period, setPeriod] = useState("daily");
  const [focus, setFocus] = useState("all");
  const [reading, setReading] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (!selectedSign) {
      setError("Please select your zodiac sign.");
      return;
    }

    setLoading(true);
    setError(null);
    setReading(null);

    try {
      const res = await fetch("/api/horoscope", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sign: selectedSign, period, focus }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setReading(data.reading);
    } catch {
      setError("Failed to connect to the horoscope service.");
    } finally {
      setLoading(false);
    }
  };

  const signData = ZODIAC_SIGNS.find((s) => s.sign === selectedSign);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900">
      <header className="bg-white/5 border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">✨</span>
          <div>
            <h1 className="text-xl font-bold text-white">AI Horoscope Generator</h1>
            <p className="text-xs text-white/40">Personalized readings · Powered by DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-white">What do the stars say? ✨</h2>
          <p className="text-white/50 text-sm">Select your zodiac sign and discover your cosmic forecast.</p>
        </div>

        {/* Sign Selector */}
        <div>
          <label className="block text-xs font-semibold text-white/60 mb-3">🌟 Your Zodiac Sign</label>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {ZODIAC_SIGNS.map((z) => (
              <button
                key={z.sign}
                onClick={() => setSelectedSign(z.sign)}
                className={`rounded-xl border px-2 py-3 text-center transition-all ${
                  selectedSign === z.sign
                    ? "border-purple-400 bg-purple-600/40 ring-1 ring-purple-400"
                    : "border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:border-white/20"
                }`}
              >
                <div className="text-2xl mb-1">{z.emoji}</div>
                <div className={`text-xs font-bold ${selectedSign === z.sign ? "text-white" : "text-white/60"}`}>{z.sign}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Period + Focus */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white/60 mb-2">📅 Period</label>
              <div className="space-y-1.5">
                {PERIODS.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPeriod(p.value)}
                    className={`w-full rounded-xl border px-4 py-2.5 text-left transition-all ${
                      period === p.value
                        ? "border-purple-400 bg-purple-600/30 ring-1 ring-purple-400"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <span className={`text-sm font-bold ${period === p.value ? "text-white" : "text-white/60"}`}>{p.label}</span>
                    <span className="text-xs text-white/40 ml-2">{p.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/60 mb-2">🎯 Focus Area</label>
              <div className="space-y-1.5">
                {FOCUS_AREAS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFocus(f.value)}
                    className={`w-full rounded-xl border px-4 py-2.5 text-left transition-all ${
                      focus === f.value
                        ? "border-purple-400 bg-purple-600/30 ring-1 ring-purple-400"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <span className={`text-sm font-bold ${focus === f.value ? "text-white" : "text-white/60"}`}>{f.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={generate}
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="animate-spin">⚙️</span>
              Reading the stars...
            </>
          ) : selectedSign ? (
            <>✨ Read My Horoscope for ${signData?.emoji} ${selectedSign}</>
          ) : (
            <>✨ Select a sign above</>
          )}
        </button>

        {error && (
          <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Reading */}
        {reading && signData && (
          <div className="bg-white/5 border border-purple-500/30 rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex items-center gap-3">
              <span className="text-3xl">{signData.emoji}</span>
              <div>
                <h3 className="text-white font-bold text-sm">
                  {selectedSign} — {period === "daily" ? "Daily" : period === "weekly" ? "Weekly" : "Monthly"} Horoscope
                </h3>
                <p className="text-white/60 text-xs">{signData.dates} · {signData.element} sign</p>
              </div>
            </div>
            <div className="px-6 py-5">
              <div
                className="text-white/85 whitespace-pre-wrap leading-relaxed text-sm"
                style={{ fontFamily: "Georgia, serif", fontSize: "0.95rem", lineHeight: "1.8" }}
              >
                {reading}
              </div>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-white/20 pb-4">
          AI Horoscope Generator · {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
