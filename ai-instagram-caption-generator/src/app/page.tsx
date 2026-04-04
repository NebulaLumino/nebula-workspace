"use client";

import { useState } from "react";

const MOODS = [
  { value: "fun", label: "😂 Fun & Playful", color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
  { value: "inspirational", label: "✨ Inspirational", color: "bg-purple-100 text-purple-700 border-purple-300" },
  { value: "professional", label: "💼 Professional", color: "bg-blue-100 text-blue-700 border-blue-300" },
  { value: "romantic", label: "💕 Romantic", color: "bg-pink-100 text-pink-700 border-pink-300" },
  { value: "travel", label: "🌍 Travel", color: "bg-teal-100 text-teal-700 border-teal-300" },
  { value: "food", label: "🍔 Food & Lifestyle", color: "bg-orange-100 text-orange-700 border-orange-300" },
  { value: "fitness", label: "💪 Fitness", color: "bg-red-100 text-red-700 border-red-300" },
  { value: "aesthetic", label: "🎨 Aesthetic", color: "bg-rose-100 text-rose-700 border-rose-300" },
];

export default function Home() {
  const [description, setDescription] = useState("");
  const [mood, setMood] = useState("fun");
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeEmoji, setIncludeEmoji] = useState(true);
  const [count, setCount] = useState(5);
  const [captions, setCaptions] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const generate = async () => {
    if (!description.trim()) {
      setError("Please describe your photo.");
      return;
    }

    setLoading(true);
    setError(null);
    setCaptions(null);

    try {
      const res = await fetch("/api/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, mood, includeHashtags, includeEmoji, count }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setCaptions(data.captions);
    } catch {
      setError("Failed to connect to the caption service.");
    } finally {
      setLoading(false);
    }
  };

  const copyCaption = (caption: string, i: number) => {
    navigator.clipboard.writeText(caption);
    setCopiedIdx(i);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const captionList = captions
    ? captions
        .split(/(?=\n?\d+\.)/)
        .map((c) => c.trim())
        .filter((c) => c.length > 0)
    : [];

  const currentMood = MOODS.find((m) => m.value === mood);

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-orange-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-rose-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">📸</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Instagram Caption Generator</h1>
            <p className="text-xs text-gray-400">Stop scrolls · Spark engagement · Powered by DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-gray-900">Your next viral caption starts here 📸</h2>
          <p className="text-gray-500 text-sm">Describe your photo and let AI craft the perfect caption.</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-rose-100 p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📸 Describe your photo <span className="text-red-400">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Golden hour beach sunset with my best friends, feeling grateful..."
              rows={3}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400 transition-all resize-none"
            />
          </div>

          {/* Mood */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">🎭 Mood / Vibe</label>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMood(m.value)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    mood === m.value
                      ? `${m.color} ring-1 ring-current`
                      : "border-gray-200 text-gray-500 hover:border-rose-300 bg-white"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeEmoji}
                onChange={(e) => setIncludeEmoji(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-rose-400 focus:ring-rose-400"
              />
              <span className="text-sm text-gray-600">Include emojis</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeHashtags}
                onChange={(e) => setIncludeHashtags(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-rose-400 focus:ring-rose-400"
              />
              <span className="text-sm text-gray-600">Include hashtags</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              📊 Number of captions ({count})
            </label>
            <input
              type="range"
              min={3}
              max={10}
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="w-full accent-rose-500"
            />
          </div>

          <button
            onClick={generate}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⚙️</span>
                Creating captions...
              </>
            ) : (
              <>📸 Generate Captions</>
            )}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {captionList.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-rose-100 overflow-hidden">
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-4">
              <h3 className="text-white font-bold text-sm">
                ✨ {captionList.length} Captions for your {currentMood?.label.split(" ")[1]} post
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {captionList.map((caption, i) => (
                <div
                  key={i}
                  className="bg-gray-50 hover:bg-rose-50 rounded-xl px-4 py-3.5 border border-gray-100 group cursor-pointer transition-all"
                  onClick={() => copyCaption(caption, i)}
                >
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{caption}</p>
                  <div className="flex items-center justify-end mt-1.5">
                    <span className={`text-xs font-semibold transition-all ${copiedIdx === i ? "text-green-500" : "text-rose-400 opacity-0 group-hover:opacity-100"}`}>
                      {copiedIdx === i ? "✅ Copied!" : "📋 Tap to copy"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 pb-4">
          AI Instagram Caption Generator · {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
