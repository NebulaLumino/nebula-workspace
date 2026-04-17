'use client';
import { useState } from 'react';
export default function PodcastIntroOutro() {
  const [showName, setShowName] = useState('');
  const [format, setFormat] = useState('standard');
  const [tone, setTone] = useState('professional');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const handleGenerate = async () => {
    if (!showName.trim()) return;
    setLoading(true); setOutput('');
    try {
      const res = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ showName, format, tone }) });
      const data = await res.json();
      setOutput(data.output || data.error || 'No response generated.');
    } catch { setOutput('Error: Failed to generate script.'); }
    setLoading(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12"><div className="text-5xl mb-4">🎙️✨</div><h1 className="text-3xl font-bold text-white mb-2">AI Podcast Intro & Outro Writer</h1><p className="text-gray-400">Write and structure podcast intros and outros with music cue suggestions</p></div>
        <div className="space-y-6 mb-8">
          <div><label className="block text-sm font-medium text-gray-300 mb-2">Podcast Name / Show Concept *</label><input type="text" value={showName} onChange={e => setShowName(e.target.value)} placeholder="e.g., The Future of Sound — a podcast about music technology" className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500 transition" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-300 mb-2">Format</label>
              <select value={format} onChange={e => setFormat(e.target.value)} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500 transition">
                <option value="standard">Standard (intro + outro)</option><option value="short">Short (15-30 sec)</option><option value="extended">Extended (1+ min cinematic)</option><option value="serial">Serial (episodic teaser)</option>
              </select></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-2">Tone</label>
              <select value={tone} onChange={e => setTone(e.target.value)} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500 transition">
                <option value="professional">Professional</option><option value="funny">Funny / Witty</option><option value="energetic">Energetic / Enthusiastic</option><option value="calm">Calm / Meditative</option><option value="mysterious">Mysterious / Intriguing</option>
              </select></div>
          </div>
          <button onClick={handleGenerate} disabled={loading || !showName.trim()} className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 text-lg shadow-lg shadow-emerald-900/30">{loading ? '⏳ Writing Script...' : '✨ Generate Intro & Outro'}</button>
        </div>
        {output && <div className="bg-gray-800/40 border border-gray-700 rounded-2xl p-6"><div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold text-white">Script</h2><button onClick={() => navigator.clipboard.writeText(output)} className="text-sm text-emerald-400 hover:text-emerald-300 transition">📋 Copy</button></div><pre className="whitespace-pre-wrap text-gray-300 text-sm leading-relaxed font-mono bg-gray-900/50 rounded-xl p-4 border border-gray-700/50 overflow-x-auto">{output}</pre></div>}
      </div>
    </div>
  );
}
