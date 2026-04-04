"use client";

import { useState } from "react";

const EVENT_TYPES = [
  "Birthday Party", "Baby Shower", "Wedding Reception", "Corporate Event",
  "Holiday Party", "Engagement Party", "Anniversary", "Graduation Party",
  "Networking Event", "Retirement Party", "Other"
];

const VIBE_OPTIONS = [
  "Casual & Fun", "Elegant & Sophisticated", "Cozy & Intimate",
  "Bold & Vibrant", "Minimalist & Modern", "Rustic & Romantic", "Retro & Nostalgic"
];

export default function Home() {
  const [form, setForm] = useState({
    eventType: "",
    date: "",
    location: "",
    guestCount: "",
    budget: "",
    preferences: "",
    vibe: "",
  });
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const generate = async () => {
    if (!form.eventType || !form.date) {
      setError("Event type and date are required.");
      return;
    }
    setLoading(true);
    setError("");
    setPlan("");

    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setPlan(data.plan);
    } catch {
      setError("Failed to connect to the planning service.");
    } finally {
      setLoading(false);
    }
  };

  const copyPlan = () => {
    navigator.clipboard.writeText(plan);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatPlan = (text: string) => {
    return text
      .replace(/## /g, '<h2 style="color:#7c3aed;font-weight:800;font-size:0.95rem;margin-top:22px;margin-bottom:10px;padding-bottom:5px;border-bottom:2px solid #ede9fe">')
      .replace(/\n/g, '<br/>');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">🎉</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Event Planning Assistant</h1>
            <p className="text-xs text-gray-400">Plan memorable events in minutes · Powered by DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="text-center mb-10 space-y-1">
          <h2 className="text-4xl font-extrabold text-gray-900">
            Plan the perfect event 🎊
          </h2>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">
            Tell us about your event — we'll create a complete plan with timeline, venue ideas, décor, catering, and a checklist.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 space-y-5">
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Event Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Event Type *</label>
                <select
                  name="eventType"
                  value={form.eventType}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all bg-white"
                >
                  <option value="">Select event type...</option>
                  {EVENT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Date *</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Guest Count</label>
                <input
                  type="number"
                  name="guestCount"
                  value={form.guestCount}
                  onChange={handleChange}
                  placeholder="50"
                  min="1"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Location / Venue</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Backyard, Community Hall, Restaurant"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Budget</label>
              <input
                type="text"
                name="budget"
                value={form.budget}
                onChange={handleChange}
                placeholder="e.g. $2,000 - $5,000"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Event Vibe</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {VIBE_OPTIONS.map((v) => (
                  <button
                    key={v}
                    onClick={() => setForm((prev) => ({ ...prev, vibe: prev.vibe === v ? "" : v }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      form.vibe === v
                        ? "bg-purple-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Special Preferences</label>
              <textarea
                name="preferences"
                value={form.preferences}
                onChange={handleChange}
                placeholder="Any dietary restrictions, allergies, must-have activities, people to invite..."
                rows={3}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none transition-all"
              />
            </div>

            <button
              onClick={generate}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⚙️</span>
                  Planning your event...
                </>
              ) : (
                <>🎉 Generate Event Plan</>
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
            {plan ? (
              <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden h-full">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 flex items-center justify-between">
                  <h3 className="text-white font-bold text-sm">🎉 Your Event Plan</h3>
                  <button
                    onClick={copyPlan}
                    className="text-xs text-white/90 hover:text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-all"
                  >
                    {copied ? "✅ Copied!" : "📋 Copy"}
                  </button>
                </div>
                <div className="px-6 py-5 overflow-y-auto max-h-[70vh]">
                  <div
                    className="text-gray-700 text-sm leading-relaxed"
                    style={{ fontSize: "0.88rem", lineHeight: "1.85" }}
                    dangerouslySetInnerHTML={{ __html: formatPlan(plan) }}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-8 text-center h-full flex flex-col justify-center items-center">
                <span className="text-5xl mb-4">🎉</span>
                <p className="text-base font-medium text-gray-500">No plan yet</p>
                <p className="text-xs text-gray-400 mt-1">Fill in the form and click Generate</p>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-10 pb-4">
          AI Event Planning Assistant · {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
