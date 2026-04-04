"use client";

import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({
    assets: "",
    family: "",
    goals: "",
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const accent = "hsl(300, 70%, 60%)";

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-gray-100 flex flex-col"
      style={{ fontFamily: "system-ui, sans-serif" }}
    >
      <header
        className="border-b px-8 py-5 flex items-center gap-3"
        style={{ borderColor: "rgba(255,255,255,0.1)" }}
      >
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: accent }} />
        <h1 className="text-xl font-bold tracking-tight">
          Inheritance & Estate Planning Summary Generator
        </h1>
        <span
          className="ml-auto text-xs px-2 py-1 rounded font-mono opacity-60"
          style={{ backgroundColor: "rgba(255,255,255,0.05)", color: accent }}
        >
          #1552
        </span>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-10 flex flex-col gap-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium opacity-80">Assets & Estate Overview</label>
            <textarea
              className="w-full rounded-lg border text-sm p-3 min-h-[120px] bg-gray-800/60 border-white/10 placeholder-white/30 focus:outline-none focus:border-white/30 resize-none"
              placeholder={"Describe all assets: real estate (address/value), investment accounts, retirement accounts, life insurance, business interests, collectibles, debts owed"}
              value={form.assets}
              onChange={(e) => setForm({ ...form, assets: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium opacity-80">Family Situation</label>
            <textarea
              className="w-full rounded-lg border text-sm p-3 min-h-[100px] bg-gray-800/60 border-white/10 placeholder-white/30 focus:outline-none focus:border-white/30 resize-none"
              placeholder={"Describe family situation: spouse, children (names/ages), dependents, special needs family members, estranged relatives, marital status"}
              value={form.family}
              onChange={(e) => setForm({ ...form, family: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium opacity-80">Estate Planning Goals (optional)</label>
            <textarea
              className="w-full rounded-lg border text-sm p-3 min-h-[80px] bg-gray-800/60 border-white/10 placeholder-white/30 focus:outline-none focus:border-white/30 resize-none"
              placeholder={"Specific goals: minimize taxes, avoid probate, protect assets from creditors, support charity, provide for minor children"}
              value={form.goals}
              onChange={(e) => setForm({ ...form, goals: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg font-semibold py-3 px-6 text-sm transition-all disabled:opacity-50 cursor-pointer"
            style={{ backgroundColor: accent, color: "#fff" }}
          >
            {loading ? "Generating..." : "Generate Estate Plan Overview"}
          </button>

          {error && <p className="text-red-400 text-sm">{error}</p>}
        </form>

        {result && (
          <div
            className="rounded-xl border p-6 text-sm leading-relaxed"
            style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)" }}
          >
            <div className="prose prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: result }} />
            </div>
          </div>
        )}
      </main>

      <footer
        className="border-t text-center py-4 text-xs opacity-40"
        style={{ borderColor: "rgba(255,255,255,0.1)" }}
      >
        AI x Finance · Cycle 52 · #1552
      </footer>
    </div>
  );
}