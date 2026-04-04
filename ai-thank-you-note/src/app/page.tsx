"use client";

import { useState } from "react";

const OCCASIONS = [
  "Gift Received", "Dinner / Party Host", "Job Interview", "Wedding Gift",
  "Baby Shower Gift", "Graduation", "Hospitality", "Support During Illness",
  "Recommendation / Referral", "Business Help", "Random Act of Kindness", "Other"
];

const TONNES = ["Warm & Sincere", "Formal & Traditional", "Casual & Friendly", "Playful & Light", "Heartfelt & Emotional"];

export default function Home() {
  const [form, setForm] = useState({
    occasion: "",
    recipient: "",
    sender: "",
    specifics: "",
    tone: "",
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const generate = async () => {
    if (!form.occasion || !form.recipient.trim()) {
      setError("Please provide the occasion and recipient name.");
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
      setError("Failed to connect to the writing service.");
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
    text.replace(/## /g, '<h2 style="color:#7c3aed;font-weight:800;font-size:0.95rem;margin-top:22px;margin-bottom:12px;padding-bottom:5px;border-bottom:2px solid #ede9fe">').replace(/\n/g, '<br/>');

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-rose-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-violet-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">💌</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Thank You Note Generator</h1>
            <p className="text-xs text-gray-400">Heartfelt notes for every occasion · Powered by DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="text-center mb-10 space-y-1">
          <h2 className="text-4xl font-extrabold text-gray-900">Say thank you beautifully 💌</h2>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">
            Tell us who you're thanking and why — get 3 personalized note options to copy and send.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input */}
          <div className="bg-white rounded-2xl shadow-lg border border-violet-100 p-6 space-y-5">
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Note Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Occasion *</label>
                <select name="occasion" value={form.occasion} onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all bg-white">
                  <option value="">Select...</option>
                  {OCCASIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tone</label>
                <select name="tone" value={form.tone} onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all bg-white">
                  <option value="">Any tone</option>
                  {TONNES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Who are you thanking? *</label>
              <input type="text" name="recipient" value={form.recipient} onChange={handleChange}
                placeholder="e.g. My sister Rachel, Mr. Thompson"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Your Name</label>
              <input type="text" name="sender" value={form.sender} onChange={handleChange}
                placeholder="e.g. Jamie"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Specific Details</label>
              <textarea name="specifics" value={form.specifics} onChange={handleChange}
                placeholder="e.g. The beautiful vase you gave us, how you stayed late to help set up, your thoughtful advice during the interview prep..."
                rows={4}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent resize-none transition-all" />
            </div>

            <button onClick={generate} disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? (
                <span><span className="animate-spin">⚙️</span> Writing your notes...</span>
              ) : (
                <span>💌 Generate Thank You Notes</span>
              )}
            </button>

            {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>}
          </div>

          {/* Output */}
          <div>
            {result ? (
              <div className="bg-white rounded-2xl shadow-lg border border-violet-100 overflow-hidden h-full">
                <div className="bg-gradient-to-r from-violet-500 to-purple-500 px-6 py-4 flex items-center justify-between">
                  <h3 className="text-white font-bold text-sm">💌 Your Thank You Notes</h3>
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
              <div className="bg-white rounded-2xl shadow-lg border border-violet-100 p-8 text-center h-full flex flex-col justify-center items-center">
                <span className="text-5xl mb-4">💌</span>
                <p className="text-base font-medium text-gray-500">No notes yet</p>
                <p className="text-xs text-gray-400 mt-1">Fill in the details and click Generate</p>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-10 pb-4">AI Thank You Note Generator · {new Date().getFullYear()}</p>
      </div>
    </main>
  );
}
