'use client';
import { useState } from 'react';
export default function PodcastRSSAnalyzer() {
  const [rssUrl, setRssUrl] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const handleGenerate = async () => {
    if (!rssUrl.trim()) return;
    setLoading(true); setOutput('');
    try {
      const res = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rssUrl }) });
      const data = await res.json();
      setOutput(data.output || data.error || 'No response generated.');
    } catch { setOutput('Error: Failed to analyze RSS.'); }
    setLoading(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12"><div className="text-5xl mb-4">📡🎙️</div><h1 className="text-3xl font-bold text-white mb-2">AI Podcast RSS Analyzer</h1><p className="text-gray-400">Analyze podcast RSS feeds for episode stats, engagement metrics, and growth tips</p></div>
        <div className="space-y-6 mb-8">
          <div><label className="block text-sm font-medium text-gray-300 mb-2">Podcast RSS Feed URL *</label><input type="url" value={rssUrl} onChange={e => setRssUrl(e.target.value)} placeholder="https://yourpodcast.com/feed.xml" className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/60 focus:border-amber-500 transition" /></div>
          <button onClick={handleGenerate} disabled={loading || !rssUrl.trim()} className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 text-lg shadow-lg shadow-amber-900/30">{loading ? '⏳ Analyzing Feed...' : '✨ Analyze Podcast RSS'}</button>
        </div>
        {output && <div className="bg-gray-800/40 border border-gray-700 rounded-2xl p-6"><div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold text-white">Analysis Results</h2><button onClick={() => navigator.clipboard.writeText(output)} className="text-sm text-amber-400 hover:text-amber-300 transition">📋 Copy</button></div><pre className="whitespace-pre-wrap text-gray-300 text-sm leading-relaxed font-mono bg-gray-900/50 rounded-xl p-4 border border-gray-700/50 overflow-x-auto">{output}</pre></div>}
      </div>
    </div>
  );
}
