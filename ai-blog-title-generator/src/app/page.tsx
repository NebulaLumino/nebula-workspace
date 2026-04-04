"use client";

import { useState } from "react";

const STYLES = [
  { value: "mixed", label: "🎲 Mixed (All Styles)", desc: "Variety of title types" },
  { value: "listicle", label: "📋 Listicle", desc: "7 Ways, 5 Tips, 10 Secrets" },
  { value: "howto", label: "🛠️ How-To", desc: "How to do something" },
  { value: "question", label: "❓ Question", desc: "Provocative questions" },
];

export default function Home() {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [style, setStyle] = useState("mixed");
  const [count, setCount] = useState(12);
  const [titles, setTitles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const generate = async () => {
    if (!topic.trim()) {
      setError("Please enter a blog topic.");
      return;
    }

    setLoading(true);
    setError(null);
    setTitles([]);

    try {
      const res = await fetch("/api/titles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, audience, style, count }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      const parsed = data.titles
        .split(/\n/)
        .map((t: string) => t.replace(/^\d+\.\s*/, "").trim())
        .filter((t: string) => t.length > 0 && t.length <= 100);

      setTitles(parsed);
    } catch {
      setError("Failed to connect to the title service.");
    } finally {
      setLoading(false);
    }
  };

  const copyOne = (title: string, i: number) => {
    navigator.clipboard.writeText(title);
    setCopiedIdx(i);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(titles.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">✍️</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Blog Title Generator</h1>
            <p className="text-xs text-gray-400">Click-worthy titles · Powered by DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-gray-900">Headlines that get clicks ✨</h2>
          <p className="text-gray-500 text-sm">Enter your topic and get blog titles that readers can&apos;t resist.</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📝 Blog Topic <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. How to build a morning routine that actually sticks..."
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">👥 Target Audience</label>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g. Busy professionals, New parents, Startup founders..."
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
            />
          </div>

          {/* Style */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">🎯 Title Style</label>
            <div className="grid grid-cols-2 gap-2">
              {STYLES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStyle(s.value)}
                  className={`rounded-xl border px-3 py-2.5 text-left transition-all ${
                    style === s.value
                      ? "border-amber-400 bg-amber-50 ring-1 ring-amber-400"
                      : "border-gray-200 hover:border-amber-300 bg-gray-50"
                  }`}
                >
                  <div className={`text-xs font-bold ${style === s.value ? "text-amber-700" : "text-gray-700"}`}>{s.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">📊 Number of titles ({count})</label>
            <input
              type="range"
              min={5}
              max={20}
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          <button
            onClick={generate}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⚙️</span>
                Generating titles...
              </>
            ) : (
              <>✍️ Generate Titles</>
            )}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {titles.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between">
              <h3 className="text-white font-bold text-sm">✨ {titles.length} Blog Titles</h3>
              <button
                onClick={copyAll}
                className="text-xs text-white/90 hover:text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-all"
              >
                {copiedAll ? "✅ Copied All!" : "📋 Copy All"}
              </button>
            </div>
            <div className="p-4 space-y-2">
              {titles.map((title, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-gray-50 hover:bg-amber-50 rounded-xl px-4 py-3 border border-gray-100 group cursor-pointer transition-all"
                  onClick={() => copyOne(title, i)}
                >
                  <span className="text-xs text-gray-300 font-mono w-5 shrink-0">{i + 1}</span>
                  <span className="text-sm text-gray-800 flex-1">{title}</span>
                  <span className={`text-xs font-semibold shrink-0 transition-all ${copiedIdx === i ? "text-green-500" : "text-gray-300 group-hover:text-amber-500"}`}>
                    {copiedIdx === i ? "✅" : "📋"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 pb-4">
          AI Blog Title Generator · {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
