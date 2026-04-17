'use client';
import { useState } from 'react';
export default function LyricsExplainer() {
  const [song, setSong] = useState('');
  const [depth, setDepth] = useState('medium');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const handleGenerate = async () => {
    if (!song.trim()) return;
    setLoading(true); setOutput('');
    try {
      const res = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ song, depth }) });
      const data = await res.json();
      setOutput(data.output || data.error || 'No response generated.');
    } catch { setOutput('Error: Failed to explain lyrics.'); }
    setLoading(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12"><div className="text-5xl mb-4">📝🎤</div><h1 className="text-3xl font-bold text-white mb-2">AI Lyrics Explainer</h1><p className="text-gray-400">Deep-dive song lyrics analysis with literary devices, themes, and historical context</p></div>
        <div className="space-y-6 mb-8">
          <div><label className="block text-sm font-medium text-gray-300 mb-2">Song (Artist — Title or paste lyrics) *</label><textarea value={song} onChange={e => setSong(e.target.value)} placeholder="e.g., Queen — Bohemian Rhapsody OR paste the lyrics here..." rows={5} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500/60 focus:border-rose-500 transition resize-none" /></div>
          <div><label className="block text-sm font-medium text-gray-300 mb-2">Analysis Depth</label>
            <select value={depth} onChange={e => setDepth(e.target.value)} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500/60 focus:border-rose-500 transition">
              <option value="quick">Quick Overview</option><option value="medium">Detailed Analysis</option><option value="deep">Deep Academic Analysis</option>
            </select></div>
          <button onClick={handleGenerate} disabled={loading || !song.trim()} className="w-full py-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 text-lg shadow-lg shadow-rose-900/30">{loading ? '⏳ Analyzing...' : '✨ Explain These Lyrics'}</button>
        </div>
        {output && <div className="bg-gray-800/40 border border-gray-700 rounded-2xl p-6"><div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold text-white">Lyrics Analysis</h2><button onClick={() => navigator.clipboard.writeText(output)} className="text-sm text-rose-400 hover:text-rose-300 transition">📋 Copy</button></div><pre className="whitespace-pre-wrap text-gray-300 text-sm leading-relaxed font-mono bg-gray-900/50 rounded-xl p-4 border border-gray-700/50 overflow-x-auto">{output}</pre></div>}
      </div>
    </div>
  );
}
