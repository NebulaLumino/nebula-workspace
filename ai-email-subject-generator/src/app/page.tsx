"use client";

import { useState } from "react";

const TONES = [
  { value: "curiosity", label: "🔮 Curiosity", desc: "Intrigue them into opening" },
  { value: "urgent", label: "⚡ Urgent", desc: "Time-sensitive, FOMO-driven" },
  { value: "friendly", label: "😊 Friendly", desc: "Warm and personal" },
  { value: "formal", label: "💼 Formal", desc: "Professional and polished" },
];

export default function Home() {
  const [purpose, setPurpose] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("curiosity");
  const [count, setCount] = useState(8);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const generate = async () => {
    if (!purpose.trim()) {
      setError("Please enter an email purpose.");
      return;
    }

    setLoading(true);
    setError(null);
    setSubjects([]);

    try {
      const res = await fetch("/api/subject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purpose, audience, tone, count }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      const parsed = data.subjects
        .split(/\n/)
        .map((s: string) => s.replace(/^\d+\.\s*/, "").trim())
        .filter((s: string) => s.length > 0);

      setSubjects(parsed);
    } catch {
      setError("Failed to connect to the subject line service.");
    } finally {
      setLoading(false);
    }
  };

  const copyAll = () => {
    navigator.clipboard.writeText(subjects.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyOne = (s: string, i: number) => {
    navigator.clipboard.writeText(s);
    setCopiedIdx(i);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <header className="bg-white/90 backdrop-blur-sm border-b border-amber-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">📧</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Email Subject Line Generator</h1>
            <p className="text-xs text-gray-400">High-open-rate subject lines · Powered by DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-gray-900">Get your emails opened 📬</h2>
          <p className="text-gray-500 text-sm">Enter your email goal and let AI generate irresistible subject lines.</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📌 Email Purpose <span className="text-red-400">*</span>
            </label>
            <textarea
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Announce a 50% off sale for our new course, Re-engage inactive subscribers, Invite to a webinar..."
              rows={3}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">👥 Target Audience</label>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g. Small business owners, SaaS founders, Newsletter subscribers..."
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
            />
          </div>

          {/* Tone */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">🎯 Tone</label>
            <div className="grid grid-cols-2 gap-2">
              {TONES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTone(t.value)}
                  className={`rounded-xl border px-3 py-2.5 text-left transition-all ${
                    tone === t.value
                      ? "border-amber-400 bg-amber-50 ring-1 ring-amber-400"
                      : "border-gray-200 hover:border-gray-300 bg-gray-50"
                  }`}
                >
                  <div className={`text-xs font-bold ${tone === t.value ? "text-amber-700" : "text-gray-700"}`}>{t.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Count */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">📊 Number of subject lines ({count})</label>
            <input
              type="range"
              min={4}
              max={15}
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
                Generating subject lines...
              </>
            ) : (
              <>📬 Generate Subject Lines</>
            )}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {subjects.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between">
              <h3 className="text-white font-bold text-sm">✨ {subjects.length} Subject Lines</h3>
              <button
                onClick={copyAll}
                className="text-xs text-white/90 hover:text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-all"
              >
                {copied ? "✅ Copied All!" : "📋 Copy All"}
              </button>
            </div>
            <div className="p-4 space-y-2">
              {subjects.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-gray-50 hover:bg-amber-50 rounded-xl px-4 py-3 border border-gray-100 group transition-all"
                >
                  <span className="text-xs text-gray-300 font-mono w-5 shrink-0">{i + 1}</span>
                  <span className="text-sm text-gray-800 flex-1">{s}</span>
                  <button
                    onClick={() => copyOne(s, i)}
                    className="text-xs text-gray-400 hover:text-amber-600 shrink-0 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    {copiedIdx === i ? "✅" : "📋"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 pb-4">
          AI Email Subject Line Generator · {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
