"use client";

import { useState } from "react";

const NICHES = [
  "True Crime",
  "Business / Entrepreneurship",
  "Technology / AI",
  "Health & Wellness",
  "Comedy / Entertainment",
  "Education / Learning",
  "Sports",
  "Politics / News",
  "Science",
  "Arts & Culture",
  "History",
  "Travel",
  "Personal Finance",
  "Parenting / Family",
  "Food & Cooking",
  "Music",
  "Storytelling / Fiction",
  "Self-Improvement",
  "Relationships / Dating",
  "Other",
];

const VIBES = [
  { value: "", label: "Any vibe" },
  { value: "professional", label: "Professional & Credible" },
  { value: "funny", label: "Funny & Hilarious" },
  { value: "deep", label: "Deep & Thoughtful" },
  { value: "energetic", label: "Energetic & Exciting" },
  { value: "calm", label: "Calm & Relaxing" },
  { value: "bold", label: "Bold & Provocative" },
  { value: "wholesome", label: "Wholesome & Heartwarming" },
  { value: "dark", label: "Dark & Mysterious" },
  { value: "inspiring", label: "Inspiring & Motivational" },
];

const AUDIENCES = [
  { value: "", label: "Any audience" },
  { value: "general", label: "General / Everyone" },
  { value: "young-adults", label: "Young Adults (18-34)" },
  { value: "professionals", label: "Professionals (25-50)" },
  { value: "entrepreneurs", label: "Entrepreneurs & Founders" },
  { value: "creatives", label: "Creatives & Artists" },
  { value: "tech-savvy", label: "Tech-Savvy / Early Adopters" },
  { value: "parents", label: "Parents & Families" },
  { value: "students", label: "Students & Learners" },
];

const FORMATS = [
  { value: "", label: "Any format" },
  { value: "interview", label: "Interview-based" },
  { value: "solo", label: "Solo Commentary" },
  { value: "storytelling", label: "Storytelling / Narrative" },
  { value: "panel", label: "Panel Discussion" },
  { value: "documentary", label: "Documentary Style" },
  { value: "educational", label: "Educational / How-to" },
];

export default function Home() {
  const [niche, setNiche] = useState("");
  const [vibe, setVibe] = useState("");
  const [audience, setAudience] = useState("");
  const [format, setFormat] = useState("");
  const [keywords, setKeywords] = useState("");
  const [names, setNames] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generate = async () => {
    if (!niche) {
      setError("Please select a podcast niche.");
      return;
    }

    setLoading(true);
    setError(null);
    setNames(null);

    try {
      const res = await fetch("/api/names", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, vibe, audience, format, keywords }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setNames(data.names);
    } catch {
      setError("Failed to connect to the naming service.");
    } finally {
      setLoading(false);
    }
  };

  const copyAll = () => {
    if (names) {
      navigator.clipboard.writeText(names);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyName = (name: string, idx: number) => {
    navigator.clipboard.writeText(name);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const parsedNames = names
    ? names
        .split(/(?=\n?\d+\.)/)
        .map((n) => n.trim())
        .filter((n) => n.length > 0)
    : [];

  return (
    <main className="min-h-screen bg-slate-900">
      <header className="bg-white/5 border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">🎙️</span>
          <div>
            <h1 className="text-xl font-bold text-white">AI Podcast Name Generator</h1>
            <p className="text-xs text-white/50">Find your perfect podcast name · Powered by DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-white">
            Name your next great podcast 🎧
          </h2>
          <p className="text-white/50 text-sm">
            Tell us about your show and let AI brainstorm the perfect name with tagline and description.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">
                🎯 Podcast Niche <span className="text-purple-400">*</span>
              </label>
              <select
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              >
                <option value="" className="bg-slate-900">Select a niche...</option>
                {NICHES.map((n) => (
                  <option key={n} value={n} className="bg-slate-900">{n}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">
                🎨 Podcast Vibe
              </label>
              <select
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              >
                {VIBES.map((v) => (
                  <option key={v.value} value={v.value} className="bg-slate-900">{v.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">
                👥 Target Audience
              </label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              >
                {AUDIENCES.map((a) => (
                  <option key={a.value} value={a.value} className="bg-slate-900">{a.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">
                🎙️ Show Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              >
                {FORMATS.map((f) => (
                  <option key={f.value} value={f.value} className="bg-slate-900">{f.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1.5">
              🔑 Keywords / Themes (optional)
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g. adventure, humor, deep dives, real stories..."
              className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>

          <button
            onClick={generate}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⚙️</span>
                Brainstorming podcast names...
              </>
            ) : (
              <>🎙️ Generate Podcast Names</>
            )}
          </button>

          {error && (
            <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {names && (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-700 px-6 py-4 flex items-center justify-between">
              <h3 className="text-white font-bold text-sm">✨ Your Podcast Names</h3>
              <button
                onClick={copyAll}
                className="text-xs text-white/90 hover:text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-all"
              >
                {copied ? "✅ Copied!" : "📋 Copy All"}
              </button>
            </div>
            <div className="p-6 space-y-4">
              {parsedNames.map((entry, idx) => {
                const parts = entry.split(/\n/);
                const nameLine = parts[0]?.replace(/^\d+\.\s*/, "").trim();
                const rest = parts.slice(1).join("\n").trim();

                return (
                  <div
                    key={idx}
                    className="bg-white/5 rounded-xl p-4 border border-white/8 hover:border-purple-500/40 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-bold text-lg truncate">{nameLine}</h4>
                        {rest && (
                          <p className="text-white/60 text-xs mt-1 leading-relaxed whitespace-pre-wrap">{rest}</p>
                        )}
                      </div>
                      <button
                        onClick={() => copyName(nameLine, idx)}
                        className="shrink-0 text-xs text-white/40 hover:text-purple-400 bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        {copiedIndex === idx ? "✅" : "📋"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <p className="text-center text-xs text-white/20 pb-6">
          AI Podcast Name Generator · {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
