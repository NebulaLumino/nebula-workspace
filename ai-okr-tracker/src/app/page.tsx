"use client";
import { useState } from 'react';

const ACCENT = 'text-blue-400';

export default function AIOkrTracker() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      setResult(data.output || data.error || '');
    } catch {
      setResult('Error generating OKRs. Please try again.');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white flex flex-col">
      <div className="border-b border-blue-900/30 px-8 py-5 flex items-center gap-3">
        <div className={`${ACCENT} text-2xl`}>🎯</div>
        <div>
          <h1 className="text-xl font-bold text-white">AI OKR Tracker</h1>
          <p className="text-sm text-gray-400">Set, align, and monitor goals with AI-powered insights</p>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-10 flex flex-col gap-6">
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 space-y-4">
          <label className={`block text-sm font-semibold ${ACCENT}`}>Describe Your Objectives & Context</label>
          <textarea
            className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-sm text-gray-100 placeholder-gray-500 resize-y min-h-48 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Describe your company, team, or personal objectives and key results you want to track. Include any context about current goals, challenges, or priorities. The AI will generate structured OKRs with measurable key results..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 rounded-xl font-semibold text-sm transition-colors"
          >
            {loading ? 'Generating OKRs...' : 'Generate OKRs'}
          </button>
        </div>

        {result && (
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 space-y-4">
            <h2 className={`text-sm font-semibold ${ACCENT}`}>AI-Generated OKRs</h2>
            <div className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">{result}</div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: '📊', title: 'OKR Creation Wizard', desc: 'Structured objectives with measurable key results' },
            { icon: '🔮', title: 'Progress Forecasting', desc: 'AI-predicted completion likelihood' },
            { icon: '⚠️', title: 'Risk Detection', desc: 'At-risk OKR alerts with remediation tips' },
            { icon: '📈', title: 'Weekly Check-ins', desc: 'Guided progress update prompts' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-gray-800/30 border border-gray-700/40 rounded-xl p-4">
              <div className="text-2xl mb-2">{icon}</div>
              <div className="text-sm font-semibold text-gray-100">{title}</div>
              <div className="text-xs text-gray-400 mt-1">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
