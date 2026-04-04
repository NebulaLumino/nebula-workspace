"use client";

import { useState } from "react";

const PET_TYPES = ["Dog", "Cat", "Rabbit", "Hamster", "Guinea Pig", "Bird", "Fish", "Reptile", "Other"];
const VIBES = ["Cute & Sweet", "Strong & Fierce", "Funny & Silly", "Elegant & Fancy", "Food-themed", "Nature-themed", "Human Name", "Pop Culture", "Unique & Weird"];
const COLORS = ["Golden / Cream", "Black & White", "Brown / Chocolate", "Gray / Silver", "Orange / Ginger", "White", "Multi-colored", "Not sure yet"];

export default function Home() {
  const [form, setForm] = useState({
    petType: "",
    breed: "",
    color: "",
    personality: "",
    vibe: "",
    count: "20",
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const generate = async () => {
    if (!form.petType) {
      setError("Please select a pet type.");
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
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setResult(data.result);
    } catch {
      setError("Failed to connect to the naming service.");
    } finally {
      setLoading(false);
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatResult = (text: string) => {
    return text
      .replace(/## /g, '<h2 style="color:#0369a1;font-weight:800;font-size:0.95rem;margin-top:22px;margin-bottom:12px;padding-bottom:5px;border-bottom:2px solid #e0f2fe">')
      .replace(/\n/g, '<br/>');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-sky-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">🐾</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Pet Name Generator</h1>
            <p className="text-xs text-gray-400">Find the perfect name for your furry friend · Powered by DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="text-center mb-10 space-y-1">
          <h2 className="text-4xl font-extrabold text-gray-900">Name your new best friend 🐾</h2>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">
            Tell us about your pet — get creative, personality-matched name suggestions they'll love for years to come.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input */}
          <div className="bg-white rounded-2xl shadow-lg border border-sky-100 p-6 space-y-5">
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">About Your Pet</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Pet Type *</label>
                <select name="petType" value={form.petType} onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all bg-white">
                  <option value="">Select...</option>
                  {PET_TYPES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5"># of Names</label>
                <select name="count" value={form.count} onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all bg-white">
                  <option value="10">10 names</option>
                  <option value="20">20 names</option>
                  <option value="30">30 names</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Breed</label>
              <input type="text" name="breed" value={form.breed} onChange={handleChange}
                placeholder="e.g. Golden Retriever, Maine Coon..."
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Color / Markings</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {COLORS.map((c) => (
                  <button key={c} onClick={() => setForm((prev) => ({ ...prev, color: prev.color === c ? "" : c }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${form.color === c ? "bg-sky-500 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Personality</label>
              <textarea name="personality" value={form.personality} onChange={handleChange}
                placeholder="e.g. Playful and energetic, loves belly rubs, a bit shy at first..."
                rows={3}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent resize-none transition-all" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Name Vibe</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {VIBES.map((v) => (
                  <button key={v} onClick={() => setForm((prev) => ({ ...prev, vibe: prev.vibe === v ? "" : v }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${form.vibe === v ? "bg-sky-500 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={generate} disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? (
                <span><span className="animate-spin">⚙️</span> Finding perfect names...</span>
              ) : (
                <span>🐾 Generate Pet Names</span>
              )}
            </button>

            {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>}
          </div>

          {/* Output */}
          <div>
            {result ? (
              <div className="bg-white rounded-2xl shadow-lg border border-sky-100 overflow-hidden h-full">
                <div className="bg-gradient-to-r from-sky-500 to-cyan-500 px-6 py-4 flex items-center justify-between">
                  <h3 className="text-white font-bold text-sm">🐾 Pet Name Ideas</h3>
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
              <div className="bg-white rounded-2xl shadow-lg border border-sky-100 p-8 text-center h-full flex flex-col justify-center items-center">
                <span className="text-5xl mb-4">🐾</span>
                <p className="text-base font-medium text-gray-500">No names yet</p>
                <p className="text-xs text-gray-400 mt-1">Tell us about your pet and click Generate</p>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-10 pb-4">AI Pet Name Generator · {new Date().getFullYear()}</p>
      </div>
    </main>
  );
}
