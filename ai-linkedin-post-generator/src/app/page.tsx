"use client";

import { useState } from "react";

const STYLES = [
  { value: "professional", label: "Professional", desc: "Authoritative, expertise-driven" },
  { value: "educational", label: "Educational", desc: "Teach something valuable" },
  { value: "inspirational", label: "Inspirational", desc: "Storytelling, emotional pull" },
  { value: "conversational", label: "Conversational", desc: "Relatable, peer-to-peer" },
];

const ENGAGEMENTS = [
  { value: "thought", label: "💭 Thought Provoking Question", desc: "Spark deep discussion" },
  { value: "connection", label: "🤝 Connect & Invite", desc: "Build relationships" },
  { value: "action", label: "🎯 Action-Oriented", desc: "Drive a specific next step" },
];

export default function Home() {
  const [topic, setTopic] = useState("");
  const [keyMessage, setKeyMessage] = useState("");
  const [style, setStyle] = useState("professional");
  const [engagement, setEngagement] = useState("thought");
  const [hashtagCount, setHashtagCount] = useState(5);
  const [post, setPost] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  const generate = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic.");
      return;
    }

    setLoading(true);
    setError(null);
    setPost(null);
    setActiveTab("write");

    try {
      const res = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, keyMessage, style, engagement, hashtagCount }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setPost(data.post);
      setActiveTab("preview");
    } catch {
      setError("Failed to connect to the post service.");
    } finally {
      setLoading(false);
    }
  };

  const copyPost = () => {
    if (post) {
      navigator.clipboard.writeText(post);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">💼</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI LinkedIn Post Generator</h1>
            <p className="text-xs text-gray-400">Build authority · Spark engagement · Powered by DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Hero */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-gray-900">Your next viral post starts here ✨</h2>
          <p className="text-gray-500 text-sm">Pick a topic, set your style, and let AI craft the perfect LinkedIn post.</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🎯 Topic <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. The biggest mistake I made as a new manager..."
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">💡 Key Message / Insight</label>
            <input
              type="text"
              value={keyMessage}
              onChange={(e) => setKeyMessage(e.target.value)}
              placeholder="What do you want readers to take away?"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
          </div>

          {/* Style */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">📝 Style</label>
            <div className="grid grid-cols-2 gap-2">
              {STYLES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStyle(s.value)}
                  className={`rounded-xl border px-3 py-2.5 text-left transition-all ${
                    style === s.value
                      ? "border-blue-500 bg-blue-50 ring-1 ring-blue-400"
                      : "border-gray-200 hover:border-gray-300 bg-gray-50"
                  }`}
                >
                  <div className={`text-xs font-bold ${style === s.value ? "text-blue-700" : "text-gray-700"}`}>{s.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">🎯 End with...</label>
            <div className="space-y-1.5">
              {ENGAGEMENTS.map((e) => (
                <button
                  key={e.value}
                  onClick={() => setEngagement(e.value)}
                  className={`w-full rounded-xl border px-3 py-2 text-left transition-all ${
                    engagement === e.value
                      ? "border-blue-500 bg-blue-50 ring-1 ring-blue-400"
                      : "border-gray-200 hover:border-gray-300 bg-gray-50"
                  }`}
                >
                  <span className={`text-xs font-bold ${engagement === e.value ? "text-blue-700" : "text-gray-700"}`}>
                    {e.label}
                  </span>
                  <span className="text-xs text-gray-400 ml-2">{e.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hashtag count */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">#️⃣ Hashtags ({hashtagCount})</label>
            <input
              type="range"
              min={3}
              max={10}
              value={hashtagCount}
              onChange={(e) => setHashtagCount(parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          <button
            onClick={generate}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⚙️</span>
                Crafting your post...
              </>
            ) : (
              <>✍️ Generate LinkedIn Post</>
            )}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        {/* Preview Card */}
        {post && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* LinkedIn-style card header */}
            <div className="px-5 pt-5 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">YOU</div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">Your Name</div>
                  <div className="text-xs text-gray-400">Your Title · Just now</div>
                </div>
              </div>
            </div>

            {/* Post content */}
            <div className="px-5 py-4">
              <div
                className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {post}
              </div>
            </div>

            {/* Actions */}
            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={copyPost}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
              >
                {copied ? "✅ Copied to clipboard!" : "📋 Copy post"}
              </button>
              <span className="text-xs text-gray-400">Paste directly into LinkedIn</span>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 pb-4">
          AI LinkedIn Post Generator · {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
