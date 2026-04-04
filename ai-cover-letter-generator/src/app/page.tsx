"use client";

import { useState } from "react";

const TONES = [
  { value: "confident", label: "✨ Confident", desc: "Enthusiastic, bold, eager" },
  { value: "formal", label: "💼 Formal", desc: "Traditional, professional" },
  { value: "friendly", label: "🤝 Friendly", desc: "Warm, approachable" },
];

export default function Home() {
  const [name, setName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [resumeHighlights, setResumeHighlights] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState("confident");
  const [letter, setLetter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!name.trim() || !jobTitle.trim() || !company.trim()) {
      setError("Please provide your name, the job title, and company name.");
      return;
    }

    setLoading(true);
    setError(null);
    setLetter(null);

    try {
      const res = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, jobTitle, company, resumeHighlights, jobDescription, tone }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setLetter(data.letter);
    } catch {
      setError("Failed to connect to the cover letter service.");
    } finally {
      setLoading(false);
    }
  };

  const copyLetter = () => {
    if (letter) {
      navigator.clipboard.writeText(letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">✉️</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Cover Letter Generator</h1>
            <p className="text-xs text-gray-400">Personalized, ATS-friendly letters · Powered by DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-extrabold text-gray-900">Get the job. Start with the letter. ✉️</h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Paste your highlights and the job description — get a personalized cover letter in seconds.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">✍️ Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Johnson"
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">💼 Job Title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Senior Product Designer"
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">🏢 Company</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Corp"
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">⭐ Your Key Achievements (optional)</label>
            <textarea
              value={resumeHighlights}
              onChange={(e) => setResumeHighlights(e.target.value)}
              placeholder="Led redesign of checkout flow, increasing conversion by 22%..."
              rows={3}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">📄 Job Description (optional)</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job posting here to get a highly tailored letter..."
              rows={4}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
          </div>

          {/* Tone */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">🎯 Tone</label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTone(t.value)}
                  className={`rounded-xl border px-4 py-2.5 text-left transition-all ${
                    tone === t.value
                      ? "border-blue-400 bg-blue-50 ring-1 ring-blue-400"
                      : "border-gray-200 hover:border-blue-300 bg-gray-50"
                  }`}
                >
                  <div className={`text-xs font-bold ${tone === t.value ? "text-blue-700" : "text-gray-700"}`}>{t.label}</div>
                  <div className="text-xs text-gray-400">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generate}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⚙️</span>
                Writing your letter...
              </>
            ) : (
              <>✉️ Generate Cover Letter</>
            )}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        {/* Letter */}
        {letter && (
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 flex items-center justify-between">
              <h3 className="text-white font-bold text-sm">✨ Your Cover Letter</h3>
              <button
                onClick={copyLetter}
                className="text-xs text-white/90 hover:text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-all"
              >
                {copied ? "✅ Copied!" : "📋 Copy"}
              </button>
            </div>
            <div className="px-8 py-6">
              <div
                className="text-gray-800 whitespace-pre-wrap leading-loose"
                style={{ fontFamily: "Georgia, serif", fontSize: "0.95rem", lineHeight: "1.8" }}
              >
                {letter}
              </div>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 pb-6">
          AI Cover Letter Generator · {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
