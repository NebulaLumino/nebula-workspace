"use client";

import { useState } from "react";

const GENRES = [
  "Pop",
  "Rock",
  "Hip-Hop / Rap",
  "R&B",
  "Country",
  "Electronic / EDM",
  "Indie / Alternative",
  "Folk",
  "Jazz",
  "Latin",
  "K-Pop",
  "Metal",
];

const MOODS = [
  "Happy & Uplifting",
  "Sad & Melancholic",
  "Energetic & Pumped",
  "Romantic & Loving",
  "Angry & Defiant",
  "Nostalgic & Reflective",
  "Chill & Relaxed",
  "Dark & Mysterious",
  "Hopeful & Inspirational",
  "Playful & Fun",
];

const STRUCTURES = [
  { value: "standard", label: "Standard (Intro → Verse → Chorus → Bridge → Outro)" },
  { value: "verses", label: "Verses Only (poetic, minimal)" },
  { value: "free", label: "Free Verse / Spoken Word" },
];

export default function Home() {
  const [genre, setGenre] = useState("");
  const [mood, setMood] = useState("");
  const [theme, setTheme] = useState("");
  const [keywords, setKeywords] = useState("");
  const [structure, setStructure] = useState("standard");
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!genre || !mood) {
      setError("Please select both a genre and a mood.");
      return;
    }

    setLoading(true);
    setError(null);
    setLyrics(null);

    try {
      const res = await fetch("/api/lyrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ genre, mood, theme, keywords, structure }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setLyrics(data.lyrics);
    } catch {
      setError("Failed to connect to the lyrics service.");
    } finally {
      setLoading(false);
    }
  };

  const copyLyrics = () => {
    if (lyrics) {
      navigator.clipboard.writeText(lyrics);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatLyrics = (text: string) => {
    return text
      .replace(/\[(VERSE [0-9]+)\]/gi, '<div class="section-label verse-label">$1</div>')
      .replace(/\[(CHORUS)\]/gi, '<div class="section-label chorus-label">$1</div>')
      .replace(/\[(BRIDGE)\]/gi, '<div class="section-label bridge-label">$1</div>')
      .replace(/\[(PRE-CHORUS)\]/gi, '<div class="section-label prechorus-label">$1</div>')
      .replace(/\[(INTRO|OUTRO|HOOK|FINAL CHORUS)\]/gi, '<div class="section-label other-label">$1</div>')
      .split("\n")
      .map((line) => {
        if (line.trim() === "") return "<br/>";
        return `<div class="lyric-line">${line}</div>`;
      })
      .join("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950">
      <header className="bg-white/5 backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">🎤</span>
          <div>
            <h1 className="text-xl font-bold text-white">AI Song Lyrics Generator</h1>
            <p className="text-xs text-white/50">Write original songs with AI · Powered by DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-white">Write your next hit 🎵</h2>
          <p className="text-white/50 text-sm">
            Pick a genre, set the mood, and let AI craft original lyrics for you.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">
                🎸 Genre <span className="text-pink-400">*</span>
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
              >
                <option value="" className="bg-slate-900">Select genre...</option>
                {GENRES.map((g) => (
                  <option key={g} value={g} className="bg-slate-900">{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">
                💜 Mood / Emotion <span className="text-pink-400">*</span>
              </label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
              >
                <option value="" className="bg-slate-900">Select mood...</option>
                {MOODS.map((m) => (
                  <option key={m} value={m} className="bg-slate-900">{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">
                🎯 Theme / Topic
              </label>
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="e.g. Summer love, heartbreak, finding yourself..."
                className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">
                🔑 Keywords
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g. stars, rain, running away..."
                className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1.5">
              📐 Song Structure
            </label>
            <div className="flex flex-wrap gap-2">
              {STRUCTURES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStructure(s.value)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    structure === s.value
                      ? "bg-purple-500 border-purple-400 text-white"
                      : "bg-white/5 border-white/15 text-white/60 hover:border-white/30"
                  }`}
                >
                  {s.label}
                </button>
              ))}
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
                Writing lyrics...
              </>
            ) : (
              <>🎤 Generate Lyrics</>
            )}
          </button>

          {error && (
            <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}
        </div>

        {/* Lyrics Output */}
        {lyrics && (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex items-center justify-between">
              <h3 className="text-white font-bold text-sm">✨ Your Original Song</h3>
              <button
                onClick={copyLyrics}
                className="text-xs text-white/90 hover:text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-all"
              >
                {copied ? "✅ Copied!" : "📋 Copy"}
              </button>
            </div>
            <div className="px-6 py-5">
              <style>{`
                .lyric-output { font-family: Georgia, serif; font-size: 0.95rem; line-height: 1.9; color: #e2e8f0; }
                .section-label { font-family: sans-serif; font-weight: 800; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 20px; margin-bottom: 4px; }
                .verse-label { color: #818cf8; }
                .chorus-label { color: #f472b6; }
                .bridge-label { color: #fbbf24; }
                .prechorus-label { color: #34d399; }
                .other-label { color: #a78bfa; }
                .lyric-line { margin: 1px 0; }
              `}</style>
              <div
                className="lyric-output"
                dangerouslySetInnerHTML={{ __html: formatLyrics(lyrics) }}
              />
            </div>
          </div>
        )}

        <p className="text-center text-xs text-white/30 pb-6">
          AI Song Lyrics Generator · {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
