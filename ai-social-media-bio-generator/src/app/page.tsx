"use client";

import { useState } from "react";

const PLATFORMS = [
  { value: "twitter", label: "𝕏 Twitter / X", emoji: "𝕏", color: "from-gray-800 to-black", limit: "160 chars" },
  { value: "instagram", label: "📷 Instagram", emoji: "📷", color: "from-purple-500 to-pink-500", limit: "150 chars" },
  { value: "linkedin", label: "💼 LinkedIn", emoji: "💼", color: "from-blue-600 to-blue-800", limit: "220 chars" },
  { value: "threads", label: "🧵 Threads", emoji: "🧵", color: "from-black to-gray-800", limit: "160 chars" },
  { value: "tiktok", label: "🎵 TikTok", emoji: "🎵", color: "from-pink-400 to-purple-600", limit: "80 chars" },
  { value: "youtube", label: "▶️ YouTube", emoji: "▶️", color: "from-red-600 to-red-800", limit: "500 chars" },
  { value: "general", label: "🌐 General / Other", emoji: "🌐", color: "from-teal-500 to-cyan-600", limit: "200 chars" },
];

const PERSONALITIES = [
  "Creative & Ambitious",
  "Bold & Visionary",
  "Witty & Playful",
  "Professional & Driven",
  "Minimalist & Focused",
  "Inspirational & Motivating",
  "Analytical & Curious",
  "Fun & Energetic",
];

export default function Home() {
  const [platform, setPlatform] = useState("twitter");
  const [profession, setProfession] = useState("");
  const [personality, setPersonality] = useState("Creative & Ambitious");
  const [audience, setAudience] = useState("");
  const [count, setCount] = useState(5);
  const [bios, setBios] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const currentPlatform = PLATFORMS.find((p) => p.value === platform);

  const generate = async () => {
    if (!profession.trim()) {
      setError("Please enter your profession or title.");
      return;
    }

    setLoading(true);
    setError(null);
    setBios(null);

    try {
      const res = await fetch("/api/bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, profession, personality, audience, count }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setBios(data.bios);
    } catch {
      setError("Failed to connect to the bio service.");
    } finally {
      setLoading(false);
    }
  };

  const copyBio = (bio: string, idx: number) => {
    const cleanBio = bio.replace(/\(\d+ chars?\)/g, "").trim();
    navigator.clipboard.writeText(cleanBio);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const bioList = bios
    ? bios
        .split(/(?=\n?\d+\.)/)
        .map((b) => b.trim())
        .filter((b) => b.length > 0)
    : [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">✨</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Social Media Bio Generator</h1>
            <p className="text-xs text-gray-400">Craft your perfect profile bio · Powered by DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-gray-900">Your profile, perfected ✨</h2>
          <p className="text-gray-500 text-sm">Generate scroll-stopping bios for any platform in seconds.</p>
        </div>

        {/* Platform selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">📱 Platform</label>
          <div className="grid grid-cols-4 gap-2">
            {PLATFORMS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPlatform(p.value)}
                className={`rounded-xl border px-2 py-2.5 text-center transition-all ${
                  platform === p.value
                    ? `border-purple-400 bg-gradient-to-br ${p.color} text-white ring-1 ring-purple-400`
                    : "border-gray-200 bg-white hover:border-purple-300"
                }`}
              >
                <div className="text-base mb-0.5">{p.emoji}</div>
                <div className={`text-xs font-bold ${platform === p.value ? "text-white" : "text-gray-700"}`}>
                  {p.label.split(" ")[0]}
                </div>
                <div className={`text-xs ${platform === p.value ? "text-white/70" : "text-gray-400"}`}>
                  {p.limit}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              💼 Profession / Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              placeholder="e.g. Senior Product Designer | AI Enthusiast | Coffee Lover"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">🎭 Personality</label>
              <select
                value={personality}
                onChange={(e) => setPersonality(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
              >
                {PERSONALITIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">👥 Target Audience</label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Startup founders, Designers, Tech recruiters..."
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              📊 Number of bios ({count})
            </label>
            <input
              type="range"
              min={3}
              max={10}
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>

          <button
            onClick={generate}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⚙️</span>
                Crafting your bios...
              </>
            ) : (
              <>✨ Generate Bios</>
            )}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {bioList.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
              <h3 className="text-white font-bold text-sm">
                ✨ {bioList.length} Bios for {currentPlatform?.label.split(" ").slice(1).join(" ")}
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {bioList.map((bio, i) => (
                <div
                  key={i}
                  className="bg-gray-50 hover:bg-purple-50 rounded-xl px-4 py-3.5 border border-gray-100 group transition-all cursor-pointer"
                  onClick={() => copyBio(bio, i)}
                >
                  <p className="text-sm text-gray-800 leading-relaxed pr-8">{bio}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs text-gray-400">Tap to copy</span>
                    <span className={`text-xs font-semibold transition-all ${copiedIdx === i ? "text-green-500" : "text-purple-400 opacity-0 group-hover:opacity-100"}`}>
                      {copiedIdx === i ? "✅ Copied!" : "📋 Copy"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 pb-4">
          AI Social Media Bio Generator · {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
