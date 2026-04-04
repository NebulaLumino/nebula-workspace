"use client";

import { useState } from "react";

const LEVELS = [
  { value: "entry", label: "Entry Level", desc: "0-2 years experience" },
  { value: "mid", label: "Mid-Level", desc: "2-5 years experience" },
  { value: "senior", label: "Senior", desc: "5-10 years experience" },
  { value: "executive", label: "Executive / Lead", desc: "10+ years experience" },
];

export default function Home() {
  const [jobTitle, setJobTitle] = useState("");
  const [level, setLevel] = useState("mid");
  const [includeBehavioral, setIncludeBehavioral] = useState(true);
  const [includeSituational, setIncludeSituational] = useState(true);
  const [includeTechnical, setIncludeTechnical] = useState(false);
  const [questions, setQuestions] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const generate = async () => {
    if (!jobTitle.trim()) {
      setError("Please enter a job title.");
      return;
    }

    setLoading(true);
    setError(null);
    setQuestions(null);

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, level, includeBehavioral, includeSituational, includeTechnical }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setQuestions(data.questions);
    } catch {
      setError("Failed to connect to the questions service.");
    } finally {
      setLoading(false);
    }
  };

  const copySection = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const sections = questions
    ? questions.split(/(?=\*\*[A-Z])/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-teal-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">🎯</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Interview Question Generator</h1>
            <p className="text-xs text-gray-400">Ace your interview prep · Powered by DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-extrabold text-gray-900">Know the questions before they ask 🎯</h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Get tailored interview questions for any role — behavioral, situational, and technical.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-teal-100 p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              💼 Job Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer, Product Manager, Data Analyst..."
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          {/* Level */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">📊 Experience Level</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {LEVELS.map((l) => (
                <button
                  key={l.value}
                  onClick={() => setLevel(l.value)}
                  className={`rounded-xl border px-3 py-2.5 text-center transition-all ${
                    level === l.value
                      ? "border-teal-400 bg-teal-50 ring-1 ring-teal-400"
                      : "border-gray-200 hover:border-teal-200 bg-gray-50"
                  }`}
                >
                  <div className={`text-xs font-bold ${level === l.value ? "text-teal-700" : "text-gray-700"}`}>{l.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{l.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Question types */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">📝 Question Types</label>
            <div className="flex flex-wrap gap-3">
              {[
                { key: "includeBehavioral", label: "🗣️ Behavioral", desc: "STAR method questions" },
                { key: "includeSituational", label: "🎯 Situational", desc: "Scenario-based" },
                { key: "includeTechnical", label: "💻 Technical", desc: "Role-specific skills" },
              ].map(({ key, label, desc }) => (
                <label
                  key={key}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                    (key === "includeBehavioral" && includeBehavioral) ||
                    (key === "includeSituational" && includeSituational) ||
                    (key === "includeTechnical" && includeTechnical)
                      ? "border-teal-400 bg-teal-50"
                      : "border-gray-200 hover:border-teal-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={
                      key === "includeBehavioral"
                        ? includeBehavioral
                        : key === "includeSituational"
                        ? includeSituational
                        : includeTechnical
                    }
                    onChange={(e) => {
                      if (key === "includeBehavioral") setIncludeBehavioral(e.target.checked);
                      if (key === "includeSituational") setIncludeSituational(e.target.checked);
                      if (key === "includeTechnical") setIncludeTechnical(e.target.checked);
                    }}
                    className="sr-only"
                  />
                  <span className={`text-sm font-bold ${(key === "includeBehavioral" && includeBehavioral) || (key === "includeSituational" && includeSituational) || (key === "includeTechnical" && includeTechnical) ? "text-teal-700" : "text-gray-600"}`}>
                    {label}
                  </span>
                  <span className="text-xs text-gray-400">{desc}</span>
                  {(key === "includeBehavioral" && includeBehavioral) ||
                  (key === "includeSituational" && includeSituational) ||
                  (key === "includeTechnical" && includeTechnical) ? (
                    <span className="ml-auto text-teal-500">✓</span>
                  ) : null}
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={generate}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⚙️</span>
                Generating questions...
              </>
            ) : (
              <>🎯 Generate Questions</>
            )}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>
          )}
        </div>

        {/* Results */}
        {sections.length > 0 && (
          <div className="space-y-4">
            {sections.map((section, i) => {
              const headerEnd = section.indexOf("\n");
              const header = headerEnd > -1 ? section.slice(0, headerEnd) : section;
              const body = headerEnd > -1 ? section.slice(headerEnd) : "";

              return (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-teal-100 overflow-hidden">
                  <div className="bg-teal-50 border-b border-teal-100 px-5 py-3 flex items-center justify-between">
                    <h3 className="font-bold text-teal-800 text-sm">{header.replace(/\*\*/g, "")}</h3>
                    <button
                      onClick={() => copySection(section, i)}
                      className="text-xs text-teal-600 hover:text-teal-800 font-semibold"
                    >
                      {copiedIdx === i ? "✅ Copied!" : "📋 Copy"}
                    </button>
                  </div>
                  <div className="px-5 py-4 space-y-3">
                    {body.split("\n").filter(l => l.trim()).map((line, j) => (
                      <p key={j} className="text-sm text-gray-700 leading-relaxed">{line}</p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-center text-xs text-gray-400 pb-6">
          AI Interview Question Generator · {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
