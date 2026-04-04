"use client";

import { useState } from "react";

const CONTENT_TYPES = [
  { value: "blog", label: "📝 Blog Post", desc: "Articles, guides, tutorials" },
  { value: "product", label: "🛒 Product Page", desc: "E-commerce, product descriptions" },
  { value: "landing", label: "🚀 Landing Page", desc: "Sales, marketing pages" },
  { value: "video", label: "▶️ YouTube / Video", desc: "Video titles, descriptions" },
  { value: "social", label: "📱 Social Media", desc: "Posts, captions, updates" },
];

function KeywordSection({ title, icon, color, items }: { title: string; icon: string; color: string; items: string[] }) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const copy = (item: string, i: number) => {
    navigator.clipboard.writeText(item);
    setCopiedIdx(i);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div className={`rounded-2xl border overflow-hidden ${color}`}>
      <div className="px-5 py-3 flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <h3 className="font-bold text-sm">{title}</h3>
      </div>
      <div className="bg-white p-4 space-y-2">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 group cursor-pointer"
            onClick={() => copy(item, i)}
          >
            <span className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-400 shrink-0">
              {i + 1}
            </span>
            <span className="text-sm text-gray-700 flex-1">{item}</span>
            <span className={`text-xs font-semibold shrink-0 ${copiedIdx === i ? "text-green-500" : "text-gray-300 group-hover:text-green-400"}`}>
              {copiedIdx === i ? "✅" : "📋"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [niche, setNiche] = useState("");
  const [audience, setAudience] = useState("");
  const [contentType, setContentType] = useState("blog");
  const [count, setCount] = useState(20);
  const [rawKeywords, setRawKeywords] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (!niche.trim()) {
      setError("Please enter a niche or topic.");
      return;
    }

    setLoading(true);
    setError(null);
    setRawKeywords(null);

    try {
      const res = await fetch("/api/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, audience, contentType, count }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setRawKeywords(data.keywords);
    } catch {
      setError("Failed to connect to the keywords service.");
    } finally {
      setLoading(false);
    }
  };

  const parseKeywords = () => {
    if (!rawKeywords) return null;

    const sections: Record<string, string[]> = {
      "Primary Keywords": [],
      "Secondary Keywords": [],
      "Long-tail Keywords": [],
      "LSI Keywords": [],
    };

    let currentSection = "";
    rawKeywords.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      const sectionMatch = trimmed.match(/^\*\*(Primary|Secondary|Long-tail|LSI)\s+Keywords\*\*/i);
      if (sectionMatch) {
        currentSection = sectionMatch[1] + " Keywords";
        return;
      }

      const itemMatch = trimmed.match(/^\d+\.\s*(.+?)(?:\s*\(|$)/);
      if (itemMatch && currentSection && sections[currentSection] !== undefined) {
        sections[currentSection].push(itemMatch[1].trim());
      }
    });

    // Fallback: if sections weren't found, just split all lines
    if (Object.values(sections).every((v) => v.length === 0)) {
      const allItems = rawKeywords
        .split("\n")
        .map((l) => l.replace(/^\d+\.\s*/, "").trim())
        .filter((l) => l && !l.startsWith("**"));
      const perSection = Math.ceil(allItems.length / 4);
      sections["Primary Keywords"] = allItems.slice(0, perSection);
      sections["Secondary Keywords"] = allItems.slice(perSection, perSection * 2);
      sections["Long-tail Keywords"] = allItems.slice(perSection * 2, perSection * 3);
      sections["LSI Keywords"] = allItems.slice(perSection * 3);
    }

    return sections;
  };

  const sections = parseKeywords();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">🔍</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI SEO Keywords Generator</h1>
            <p className="text-xs text-gray-400">Keyword research powered by AI · Powered by DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-gray-900">Find the keywords that rank 📈</h2>
          <p className="text-gray-500 text-sm">Get primary, secondary, long-tail, and LSI keywords for any niche.</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🎯 Niche / Topic <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g. Running shoes for beginners, Digital marketing tools, Keto meal prep..."
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">👥 Target Audience</label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Small business owners, New parents, Fitness enthusiasts..."
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">📄 Content Type</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              >
                {CONTENT_TYPES.map((ct) => (
                  <option key={ct.value} value={ct.value}>{ct.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">📊 Total keywords ({count})</label>
            <input
              type="range"
              min={10}
              max={40}
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          <button
            onClick={generate}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⚙️</span>
                Researching keywords...
              </>
            ) : (
              <>🔍 Generate Keywords</>
            )}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {sections && (
          <div className="space-y-4">
            <KeywordSection
              title="Primary Keywords"
              icon="🎯"
              color="border-blue-200 bg-blue-50"
              items={sections["Primary Keywords"]}
            />
            <KeywordSection
              title="Secondary Keywords"
              icon="📌"
              color="border-indigo-200 bg-indigo-50"
              items={sections["Secondary Keywords"]}
            />
            <KeywordSection
              title="Long-tail Keywords"
              icon="🎣"
              color="border-teal-200 bg-teal-50"
              items={sections["Long-tail Keywords"]}
            />
            <KeywordSection
              title="LSI Keywords"
              icon="🔗"
              color="border-purple-200 bg-purple-50"
              items={sections["LSI Keywords"]}
            />
          </div>
        )}

        <p className="text-center text-xs text-gray-400 pb-4">
          AI SEO Keywords Generator · {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
