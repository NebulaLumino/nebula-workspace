"use client";

import { useState } from "react";

function renderMarkdown(text: string) {
  return text.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-white mt-7 mb-3 col-span-full">{trimmed.replace("## ","")}</h2>;
    if (trimmed.startsWith("### ")) return <h3 key={i} className="text-sm font-bold text-amber-300 mt-4 mb-2">{trimmed.replace("### ","")}</h3>;
    if (trimmed.startsWith("**") && !trimmed.includes("\n")) return <p key={i} className="text-amber-200 font-semibold text-xs mt-2 mb-0.5">{trimmed.replace(/\*\*/g,"")}</p>;
    if (trimmed.startsWith("- ")) return <li key={i} className="text-slate-300 text-xs ml-4 mb-0.5 list-disc">{trimmed.replace("- ","")}</li>;
    if (/^\d+\.\s/.test(trimmed)) return <li key={i} className="text-slate-300 text-xs ml-4 mb-0.5">{trimmed}</li>;
    if (trimmed === "") return <div key={i} className="h-1.5" />;
    return <p key={i} className="text-slate-300 text-xs leading-relaxed mb-0.5">{trimmed}</p>;
  });
}

export default function Home() {
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("");
  const [attendees, setAttendees] = useState("");
  const [companyBackground, setCompanyBackground] = useState("");
  const [keyMessages, setKeyMessages] = useState("");
  const [competitors, setCompetitors] = useState("");
  const [logistics, setLogistics] = useState("");
  const [goals, setGoals] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const generate = async () => {
    if (!eventName.trim()) { setError("Event name is required."); return; }
    setLoading(true);
    setError("");
    setResult("");
    setDone(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventName, eventType, attendees, companyBackground, keyMessages, competitors, logistics, goals }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Generation failed."); return; }
      setResult(data.result);
      setDone(true);
    } catch { setError("Failed to connect."); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950">
      <header className="border-b border-white/10 sticky top-0 z-10 bg-slate-950/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">🎪</span>
          <div>
            <h1 className="text-xl font-bold text-white">AI Event Briefing Generator</h1>
            <p className="text-xs text-slate-400">Event marketing · Executive briefings · DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Prepare Your Team for Any Event in Minutes 🎪</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">Generate complete event briefings: attendee intel, talking points, competitive positioning, session brief, booth playbook, and post-event plan.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🎪 Event Name *</label>
              <input value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="e.g. TechSummit 2026, SaaStr Annual"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">📋 Event Type</label>
              <select value={eventType} onChange={(e) => setEventType(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
                <option value="" className="bg-slate-800">Select type...</option>
                <option value="Conference (speaking slot)" className="bg-slate-800">Conference (speaking)</option>
                <option value="Trade show / expo" className="bg-slate-800">Trade show / expo</option>
                <option value="Webinar / virtual event" className="bg-slate-800">Webinar / virtual</option>
                <option value="Executive dinner / roundtable" className="bg-slate-800">Executive dinner</option>
                <option value="Sales meeting / prospect day" className="bg-slate-800">Sales meeting</option>
                <option value="Press / media event" className="bg-slate-800">Press / media event</option>
              </select>
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">👥 Attendees</label>
              <input value={attendees} onChange={(e) => setAttendees(e.target.value)} placeholder="e.g. 500+ CTOs and VPs, enterprise IT leaders"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🏢 Company Background</label>
              <input value={companyBackground} onChange={(e) => setCompanyBackground(e.target.value)} placeholder="e.g. NovaTask — $10M ARR, 200 customers, Series A"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
            <div className="md:col-span-2">
              <label className="text-white font-semibold text-sm block mb-2">💬 Key Messages</label>
              <textarea value={keyMessages} onChange={(e) => setKeyMessages(e.target.value)} rows={2}
                placeholder="e.g. Reduce deployment time by 70%, enterprise-grade security, integrates with existing stack..."
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">⚔️ Competitors Presenting</label>
              <input value={competitors} onChange={(e) => setCompetitors(e.target.value)} placeholder="e.g. Salesforce, HubSpot, a16z-backed competitor"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">📍 Logistics</label>
              <input value={logistics} onChange={(e) => setLogistics(e.target.value)} placeholder="e.g. March 15-17, San Francisco, Booth #42, 30-min speaking slot"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
            <div className="md:col-span-2">
              <label className="text-white font-semibold text-sm block mb-2">🎯 Goals</label>
              <input value={goals} onChange={(e) => setGoals(e.target.value)} placeholder="e.g. 100 qualified leads, 5 media mentions, $500K pipeline from event"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
          </div>

          <button onClick={generate} disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2">
            {loading ? <><span className="animate-spin text-xl">⚙️</span> Preparing briefing...</> : <><span>🎪</span> Generate Event Briefing</>}
          </button>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-5 py-3 text-red-300 text-sm">{error}</div>}

        {done && result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-amber-500/10 border-b border-amber-500/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎪</span>
                <p className="text-amber-300 font-bold text-sm">Event Briefing: {eventName}</p>
              </div>
              <button onClick={() => navigator.clipboard?.writeText(result)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-xs border border-white/10 transition-all">
                📋 Copy All
              </button>
            </div>
            <div className="px-6 py-5">
              {renderMarkdown(result)}
            </div>
          </div>
        )}

        <p className="text-center text-xs text-slate-600">AI Event Briefing Generator · {new Date().getFullYear()} · DeepSeek</p>
      </div>
    </main>
  );
}
