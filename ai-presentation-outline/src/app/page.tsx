"use client";

import { useState } from "react";

const TYPES = [
  { value: "business", label: "💼 Business", desc: "Professional, structured" },
  { value: "pitch", label: "🚀 Pitch Deck", desc: "Persuasive, concise" },
  { value: "educational", label: "📚 Educational", desc: "Clear, explanatory" },
  { value: "keynote", label: "🎤 Keynote", desc: "Inspirational, narrative" },
];

const DURATIONS = [
  { value: 5, label: "5 min", slides: "5 slides" },
  { value: 10, label: "10 min", slides: "8 slides" },
  { value: 20, label: "20 min", slides: "12 slides" },
  { value: 45, label: "45 min", slides: "15 slides" },
];

export default function Home() {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [duration, setDuration] = useState(10);
  const [presentationType, setPresentationType] = useState("business");
  const [outline, setOutline] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!topic.trim()) {
      setError("Please enter a presentation topic.");
      return;
    }

    setLoading(true);
    setError(null);
    setOutline(null);

    try {
      const res = await fetch("/api/outline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, audience, duration, presentationType }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setOutline(data.outline);
    } catch {
      setError("Failed to connect to the outline service.");
    } finally {
      setLoading(false);
    }
  };

  const copyOutline = () => {
    if (outline) {
      navigator.clipboard.writeText(outline);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const slidesForDuration = DURATIONS.find((d) => d.value === duration);

  const formatOutline = (text: string) => {
    return text
      .split("\n")
      .map((line) => {
        if (line.startsWith("**Slide") && line.endsWith("**")) {
          return `<h3 style="color:#1e40af;font-weight:800;font-size:0.95rem;margin-top:20px;margin-bottom:8px;padding:10px 14px;background:#eff6ff;border-radius:8px;border-left:4px solid #3b82f6">${line.replace(/\*\*/g, "")}</h3>`;
        }
        if (line.startsWith("💡 Visual:") || line.startsWith("💡visual:")) {
          return `<p style="margin:4px 0;padding:6px 12px;background:#fef9c3;border-radius:6px;font-size:0.8rem;color:#854d0e"><strong>💡 Visual:</strong> ${line.replace("💡 Visual:", "").replace("💡visual:", "")}</p>`;
        }
        if (line.trim().startsWith("-")) {
          return `<li style="margin:3px 0;padding-left:4px;color:#374151;font-size:0.85rem">${line.trim()}</li>`;
        }
        if (line.trim() === "") return "<br/>";
        return `<p style="margin:3px 0;color:#374151;font-size:0.85rem">${line}</p>`;
      })
      .join("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">📊</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Presentation Outline Generator</h1>
            <p className="text-xs text-gray-400">Slide-by-slide outlines · Powered by DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-extrabold text-gray-900">Build a presentation that lands 📊</h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Enter your topic and get a complete slide-by-slide outline with talking points and visual suggestions.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🎯 Presentation Topic <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. The Future of Remote Work, How AI is Reshaping Healthcare..."
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">👥 Target Audience</label>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g. C-suite executives, engineering team, college students..."
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">⏱️ Duration</label>
              <div className="space-y-1.5">
                {DURATIONS.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDuration(d.value)}
                    className={`w-full rounded-xl border px-4 py-2.5 text-left transition-all ${
                      duration === d.value
                        ? "border-purple-400 bg-purple-50 ring-1 ring-purple-400"
                        : "border-gray-200 hover:border-purple-200 bg-gray-50"
                    }`}
                  >
                    <span className={`text-sm font-bold ${duration === d.value ? "text-purple-700" : "text-gray-700"}`}>{d.label}</span>
                    <span className="text-xs text-gray-400 ml-2">→ {d.slides}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">📊 Presentation Type</label>
              <div className="space-y-1.5">
                {TYPES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setPresentationType(t.value)}
                    className={`w-full rounded-xl border px-4 py-2.5 text-left transition-all ${
                      presentationType === t.value
                        ? "border-purple-400 bg-purple-50 ring-1 ring-purple-400"
                        : "border-gray-200 hover:border-purple-200 bg-gray-50"
                    }`}
                  >
                    <div className={`text-sm font-bold ${presentationType === t.value ? "text-purple-700" : "text-gray-700"}`}>{t.label}</div>
                    <div className="text-xs text-gray-400">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={generate}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⚙️</span>
                Building your outline...
              </>
            ) : (
              <>📊 Generate Outline</>
            )}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        {/* Outline */}
        {outline && (
          <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-sm">✨ Presentation Outline</h3>
                <p className="text-white/60 text-xs">{slidesForDuration?.slides} · {duration} minutes</p>
              </div>
              <button
                onClick={copyOutline}
                className="text-xs text-white/90 hover:text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-all"
              >
                {copied ? "✅ Copied!" : "📋 Copy"}
              </button>
            </div>
            <div className="px-6 py-5">
              <div
                className="text-gray-700"
                dangerouslySetInnerHTML={{ __html: formatOutline(outline) }}
              />
            </div>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 pb-6">
          AI Presentation Outline Generator · {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
