"use client";

import { useState } from "react";

const OCCASIONS = [
  "Birthday", "Christmas", "Wedding", "Anniversary", "Baby Shower",
  "Housewarming", "Graduation", "Mother's Day", "Father's Day",
  "Valentine's Day", "Just Because", "Corporate / Thank You", "Other"
];

const RELATIONSHIPS = [
  "Spouse / Partner", "Parent", "Sibling", "Child", "Grandparent",
  "Friend", "Coworker / Boss", "Client", "Teacher", "Other"
];

export default function Home() {
  const [form, setForm] = useState({
    recipient: "",
    relationship: "",
    occasion: "",
    interests: "",
    budget: "",
    extra: "",
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const generate = async () => {
    if (!form.recipient.trim() || !form.occasion) {
      setError("Recipient and occasion are required.");
      return;
    }
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/recommend", {
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
      setError("Failed to connect to the recommendation service.");
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
      .replace(/## /g, '<h2 style="color:#9d174d;font-weight:800;font-size:0.95rem;margin-top:20px;margin-bottom:10px;padding-bottom:5px;border-bottom:2px solid #fce7f3">')
      .replace(/\n/g, '<br/>');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-rose-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">🎁</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Gift Recommender</h1>
            <p className="text-xs text-gray-400">Find the perfect gift every time · Powered by DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="text-center mb-10 space-y-1">
          <h2 className="text-4xl font-extrabold text-gray-900">
            Find the perfect gift 🎁
          </h2>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">
            Tell us about your recipient and occasion — get thoughtful, personalized gift ideas they'll love.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-rose-100 p-6 space-y-5">
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Gift Details</h3>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Recipient *</label>
              <input
                type="text"
                name="recipient"
                value={form.recipient}
                onChange={handleChange}
                placeholder="e.g. My sister Sarah, My boss Mr. Chen"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Occasion *</label>
                <select
                  name="occasion"
                  value={form.occasion}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all bg-white"
                >
                  <option value="">Select...</option>
                  {OCCASIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Relationship</label>
                <select
                  name="relationship"
                  value={form.relationship}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all bg-white"
                >
                  <option value="">Select...</option>
                  {RELATIONSHIPS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Their Interests</label>
              <textarea
                name="interests"
                value={form.interests}
                onChange={handleChange}
                placeholder="e.g. Loves cooking, hiking, sci-fi novels, True Crime podcasts..."
                rows={3}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent resize-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Budget</label>
              <input
                type="text"
                name="budget"
                value={form.budget}
                onChange={handleChange}
                placeholder="e.g. Under $50, $100-150, No limit"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Anything Else</label>
              <textarea
                name="extra"
                value={form.extra}
                onChange={handleChange}
                placeholder="Allergies, dislikes, things they already have, specific preferences..."
                rows={2}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent resize-none transition-all"
              />
            </div>

            <button
              onClick={generate}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="animate-spin">⚙️</span>Finding perfect gifts...</>
              ) : (
                <>🎁 Find Gifts</>
              )}
            </button>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}
          </div>

          {/* Output */}
          <div>
            {result ? (
              <div className="bg-white rounded-2xl shadow-lg border border-rose-100 overflow-hidden h-full">
                <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-4 flex items-center justify-between">
                  <h3 className="text-white font-bold text-sm">🎁 Gift Recommendations</h3>
                  <button
                    onClick={copyResult}
                    className="text-xs text-white/90 hover:text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-all"
                  >
                    {copied ? "✅ Copied!" : "📋 Copy"}
                  </button>
                </div>
                <div className="px-6 py-5 overflow-y-auto max-h-[70vh]">
                  <div
                    className="text-gray-700 text-sm"
                    style={{ fontSize: "0.88rem", lineHeight: "1.85" }}
                    dangerouslySetInnerHTML={{ __html: formatResult(result) }}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-rose-100 p-8 text-center h-full flex flex-col justify-center items-center">
                <span className="text-5xl mb-4">🎁</span>
                <p className="text-base font-medium text-gray-500">No recommendations yet</p>
                <p className="text-xs text-gray-400 mt-1">Fill in the form and click Find Gifts</p>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-10 pb-4">
          AI Gift Recommender · {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
