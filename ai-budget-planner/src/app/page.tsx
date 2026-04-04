"use client";

import { useState } from "react";

export default function Home() {
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState("");
  const [goals, setGoals] = useState("");
  const [timeframe, setTimeframe] = useState("monthly");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!income || Number(income) <= 0) {
      setError("Please enter a valid monthly income.");
      return;
    }
    setLoading(true);
    setError("");
    setPlan("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ income, expenses, goals, timeframe }),
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
      .replace(/## /g, '<h2 style="color:#065f46;font-weight:800;font-size:0.95rem;margin-top:20px;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid #d1fae5">')
      .replace(/\n/g, '<br/>')
      .replace(/\$[\d,]+(\.\d{2})?/g, (m) => `<strong style="color:#059669">${m}</strong>`)
      .replace(/(\d+(\.\d+)?%)/g, `<strong style="color:#7c3aed">$1</strong>`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">💰</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Budget Planner</h1>
            <p className="text-xs text-gray-400">Smart budgeting powered by DeepSeek AI</p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="text-center mb-10 space-y-1">
          <h2 className="text-4xl font-extrabold text-gray-900">
            Take control of your money 💸
          </h2>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">
            Enter your income and goals — get a personalized monthly budget plan with savings strategies and money-saving tips.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6 space-y-5">
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Your Finances</h3>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                💵 Monthly Net Income ($) *
              </label>
              <input
                type="number"
                min="0"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="5000"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                📉 Current Monthly Expenses
              </label>
              <textarea
                value={expenses}
                onChange={(e) => setExpenses(e.target.value)}
                placeholder="e.g. Rent $1500, Car payment $400, Netflix $15, Gym $30..."
                rows={4}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent resize-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                🎯 Financial Goals
              </label>
              <textarea
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="e.g. Build emergency fund, pay off student loans, save for vacation..."
                rows={3}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent resize-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">📅 Timeframe</label>
              <div className="flex gap-3">
                {["monthly", "quarterly", "yearly"].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                      timeframe === tf
                        ? "bg-emerald-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generate}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⚙️</span>
                  Planning your budget...
                </>
              ) : (
                <>💰 Generate Budget Plan</>
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
              <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden h-full">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 flex items-center justify-between">
                  <h3 className="text-white font-bold text-sm">💰 Your Budget Plan</h3>
                  <button
                    onClick={copyPlan}
                    className="text-xs text-white/90 hover:text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-all"
                  >
                    {copied ? "✅ Copied!" : "📋 Copy"}
                  </button>
                </div>
                <div className="px-6 py-5">
                  <div
                    className="text-gray-700 text-sm leading-relaxed"
                    style={{ fontSize: "0.9rem", lineHeight: "1.8" }}
                    dangerouslySetInnerHTML={{ __html: formatPlan(plan) }}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-8 text-center h-full flex flex-col justify-center items-center">
                <span className="text-5xl mb-4">💰</span>
                <p className="text-base font-medium text-gray-500">No plan yet</p>
                <p className="text-xs text-gray-400 mt-1">Enter your income and click Generate</p>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-10 pb-4">
          AI Budget Planner · {new Date().getFullYear()} · For educational purposes only
        </p>
      </div>
    </main>
  );
}
