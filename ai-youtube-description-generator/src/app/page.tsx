"use client";

import { useState } from "react";

const STYLES = [
  { value: "fun", label: "🎉 Fun & Energetic", desc: "Casual, entertaining, high energy" },
  { value: "professional", label: "🎓 Professional", desc: "Educational, authoritative, polished" },
  { value: "friendly", label: "🤗 Friendly", desc: "Conversational, relatable, warm" },
];

export default function Home() {
  const [title, setTitle] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [includeTimestamps, setIncludeTimestamps] = useState(true);
  const [style, setStyle] = useState("friendly");
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const generate = async () => {
    if (!title.trim()) {
      setError("Please enter your video title.");
      return;
    }

    setLoading(true);
    setError(null);
    setDescription(null);

    try {
      const res = await fetch("/api/description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, keyPoints, seoKeywords, includeTimestamps, style }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setDescription(data.description);
      setCharCount(data.description.length);
    } catch {
      setError("Failed to connect to the description service.");
    } finally {
      setLoading(false);
    }
  };

  const copyDescription = () => {
    if (description) {
      navigator.clipboard.writeText(description);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-orange-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-red-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">▶️</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI YouTube Description Generator</h1>
            <p className="text-xs text-gray-400">SEO-optimized descriptions · Powered by DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-gray-900">Get more views with perfect descriptions 📈</h2>
          <p className="text-gray-500 text-sm">Enter your video details and get a description optimized for search and engagement.</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🎬 Video Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. How I Learned to Code in 6 Months — Full Journey"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">📌 Key Points / Chapters</label>
              <textarea
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                placeholder="Introduction, Setting up environment, Writing first app, Deployment..."
                rows={3}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">🔑 SEO Keywords</label>
              <textarea
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                placeholder="learn to code, programming for beginners, coding journey..."
                rows={3}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
              />
            </div>
          </div>

          {/* Style */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">🎯 Tone</label>
            <div className="grid grid-cols-3 gap-2">
              {STYLES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStyle(s.value)}
                  className={`rounded-xl border px-3 py-2.5 text-left transition-all ${
                    style === s.value
                      ? "border-red-400 bg-red-50 ring-1 ring-red-400"
                      : "border-gray-200 hover:border-red-300 bg-gray-50"
                  }`}
                >
                  <div className={`text-xs font-bold ${style === s.value ? "text-red-700" : "text-gray-700"}`}>{s.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeTimestamps}
              onChange={(e) => setIncludeTimestamps(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-400"
            />
            <span className="text-sm text-gray-600">Include suggested timestamps</span>
          </label>

          <button
            onClick={generate}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⚙️</span>
                Generating description...
              </>
            ) : (
              <>▶️ Generate Description</>
            )}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        {/* Result */}
        {description && (
          <div className="bg-white rounded-2xl shadow-lg border border-red-100 overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-sm">✨ Your YouTube Description</h3>
                <p className="text-white/70 text-xs">{charCount} characters · {Math.round(charCount / 5)} avg words per line</p>
              </div>
              <button
                onClick={copyDescription}
                className="text-xs text-white/90 hover:text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-all"
              >
                {copied ? "✅ Copied!" : "📋 Copy"}
              </button>
            </div>
            <div className="px-6 py-5">
              <pre
                className="text-gray-700 whitespace-pre-wrap leading-relaxed"
                style={{ fontFamily: "Georgia, serif", fontSize: "0.9rem" }}
              >
                {description}
              </pre>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 pb-4">
          AI YouTube Description Generator · {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
