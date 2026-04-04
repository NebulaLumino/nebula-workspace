"use client";

import { useState } from "react";

const GENRES = [
  "Fantasy", "Science Fiction", "Mystery / Thriller", "Romance",
  "Horror", "Historical Fiction", "Literary Fiction", "Adventure",
  "Dystopian / Post-Apocalyptic", "Crime / Noir", "Comedy", "Drama"
];

const TONES = [
  "Dark & Gritty", "Epic & Grand", "Light & Humorous", "Tense & Suspenseful",
  "Whimsical & Magical", "Realistic & Grounded", "Romantic & Sweeping", "Mysterious & Enigmatic"
];

export default function Home() {
  const [form, setForm] = useState({
    genre: "",
    premise: "",
    characters: "",
    setting: "",
    tone: "",
    twist: false,
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const generate = async () => {
    if (!form.genre) {
      setError("Please select a genre.");
      return;
    }
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); return; }
      setResult(data.result);
    } catch {
      setError("Failed to connect to the plotting service.");
    } finally {
      setLoading(false);
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatResult = (text: string) =>
    text
      .replace(/## /g, '<h2 style="color:#b45309;font-weight:800;font-size:0.95rem;margin-top:24px;margin-bottom:12px;padding-bottom:6px;border-bottom:2px solid #fef3c7">')
      .replace(/\n/g, '<br/>');

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">📚</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Story Plot Generator</h1>
            <p className="text-xs text-gray-400">Build compelling stories from scratch · Powered by DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="text-center mb-10 space-y-1">
          <h2 className="text-4xl font-extrabold text-gray-900">Spark your next great story ✨</h2>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">
            Pick a genre, add a premise or let the AI get creative — get complete plot outlines, character arcs, and writing prompts.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input */}
          <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6 space-y-5">
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Story Details</h3>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Genre *</label>
              <div className="flex flex-wrap gap-2">
                {GENRES.map((g) => (
                  <button key={g} onClick={() => setForm((p) => ({ ...p, genre: p.genre === g ? "" : g }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${form.genre === g ? "bg-orange-500 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Premise / Core Idea</label>
              <textarea name="premise" value={form.premise} onChange={handleChange}
                placeholder="e.g. A retired detective must solve one last case before losing their memory, or: a map to a hidden kingdom appears in a library book..."
                rows={3}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none transition-all" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Main Characters</label>
              <textarea name="characters" value={form.characters} onChange={handleChange}
                placeholder="e.g. A cynical librarian, a mysterious teenager with a secret, or leave blank for the AI to create..."
                rows={2}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none transition-all" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Setting</label>
                <input type="text" name="setting" value={form.setting} onChange={handleChange}
                  placeholder="e.g. 1920s Paris, a dying space station..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tone</label>
                <select name="tone" value={form.tone} onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all bg-white">
                  <option value="">Genre-typical</option>
                  {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" name="twist" checked={form.twist} onChange={handleChange}
                className="w-4 h-4 accent-orange-500" />
              <label className="text-xs text-gray-600">Include a compelling story twist</label>
            </div>

            <button onClick={generate} disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? (
                <span><span className="animate-spin">⚙️</span> Crafting your story...</span>
              ) : (
                <span>📚 Generate Story Plot</span>
              )}
            </button>

            {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>}
          </div>

          {/* Output */}
          <div>
            {result ? (
              <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden h-full">
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4 flex items-center justify-between">
                  <h3 className="text-white font-bold text-sm">📖 Your Story Plot</h3>
                  <button onClick={copyResult}
                    className="text-xs text-white/90 hover:text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-all">
                    {copied ? "✅ Copied!" : "📋 Copy"}
                  </button>
                </div>
                <div className="px-6 py-5 overflow-y-auto max-h-[70vh]">
                  <div className="text-gray-700 text-sm" style={{ fontSize: "0.88rem", lineHeight: "1.85" }}
                    dangerouslySetInnerHTML={{ __html: formatResult(result) }} />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-8 text-center h-full flex flex-col justify-center items-center">
                <span className="text-5xl mb-4">📚</span>
                <p className="text-base font-medium text-gray-500">No plot yet</p>
                <p className="text-xs text-gray-400 mt-1">Select a genre and click Generate</p>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-10 pb-4">AI Story Plot Generator · {new Date().getFullYear()}</p>
      </div>
    </main>
  );
}
