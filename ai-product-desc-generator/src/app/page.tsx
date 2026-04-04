"use client";

import { useState } from "react";

const TONES = [
  { value: "professional", label: "Professional", desc: "Trustworthy, clear, authoritative" },
  { value: "fun", label: "Fun & Playful", desc: "Conversational, witty, lighthearted" },
  { value: "luxury", label: "Luxury & Premium", desc: "Elegant, sophisticated, exclusive" },
  { value: "urgent", label: "Urgent & Persuasive", desc: "FOMO-driven, action-oriented" },
];

const FORMATS = [
  { value: "short", label: "Short — 2-3 punchy sentences" },
  { value: "medium", label: "Medium — 1-2 engaging paragraphs" },
  { value: "detailed", label: "Detailed — full 3-4 paragraph writeup" },
];

export default function Home() {
  const [product, setProduct] = useState("");
  const [features, setFeatures] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("professional");
  const [format, setFormat] = useState("medium");
  const [seo, setSeo] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!product.trim()) {
      setError("Please enter a product name.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, features, audience, tone, format, seo }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setResult(data.description);
    } catch {
      setError("Failed to connect to the description service.");
    } finally {
      setLoading(false);
    }
  };

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <header className="bg-white/90 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">🛍️</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Product Description Generator</h1>
            <p className="text-xs text-gray-400">Write descriptions that sell · Powered by DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-gray-900">Turn browsers into buyers 🛒</h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Enter your product details and let AI craft descriptions that convert.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6 space-y-5">
          {/* Product */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📦 Product Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="e.g. Wireless Noise-Canceling Headphones"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
            />
          </div>

          {/* Features + Audience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">⭐ Key Features</label>
              <textarea
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                placeholder="40hr battery, USB-C, foldable design..."
                rows={2}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">👥 Target Audience</label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Remote workers, frequent travelers..."
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
              />
            </div>
          </div>

          {/* Tone */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">🎯 Tone</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {TONES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTone(t.value)}
                  className={`rounded-xl border px-3 py-2.5 text-left transition-all ${
                    tone === t.value
                      ? "border-emerald-400 bg-emerald-50 ring-1 ring-emerald-400"
                      : "border-gray-200 hover:border-gray-300 bg-gray-50"
                  }`}
                >
                  <div className={`text-xs font-bold ${tone === t.value ? "text-emerald-700" : "text-gray-700"}`}>
                    {t.label}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5 leading-tight">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Format */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">📏 Format</label>
            <div className="flex flex-wrap gap-2">
              {FORMATS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFormat(f.value)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    format === f.value
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "border-gray-200 text-gray-600 hover:border-emerald-300"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* SEO Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={seo}
              onChange={(e) => setSeo(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-400"
            />
            <span className="text-sm text-gray-600">Include SEO meta description</span>
          </label>

          {/* Generate */}
          <button
            onClick={generate}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⚙️</span>
                Writing your description...
              </>
            ) : (
              <>🛍️ Generate Description</>
            )}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        {/* Result */}
        {result && (
          <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4 flex items-center justify-between">
              <h3 className="text-white font-bold text-sm">✨ Your Product Description</h3>
              <button
                onClick={copyResult}
                className="text-xs text-white/90 hover:text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-all"
              >
                {copied ? "✅ Copied!" : "📋 Copy"}
              </button>
            </div>
            <div className="px-6 py-5">
              <div
                className="text-gray-700 whitespace-pre-wrap leading-relaxed"
                style={{ fontFamily: "Georgia, serif", fontSize: "0.95rem" }}
              >
                {result}
              </div>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 pb-6">
          AI Product Description Generator · {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
