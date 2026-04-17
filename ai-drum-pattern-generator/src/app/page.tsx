'use client';

import { useState } from 'react';

export default function DrumPatternGenerator() {
  const [genre, setGenre] = useState('house');
  const [bpm, setBpm] = useState('128');
  const [complexity, setComplexity] = useState('moderate');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setOutput('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ genre, bpm, complexity }),
      });
      const data = await res.json();
      setOutput(data.output || data.error || 'No response generated.');
    } catch {
      setOutput('Error: Failed to generate drum pattern.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">🥁</div>
          <h1 className="text-3xl font-bold text-white mb-2">AI Drum Pattern Generator</h1>
          <p className="text-gray-400">Generate drum patterns with beats, fills, and swing variations across genres</p>
        </div>

        <div className="space-y-6 mb-8">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500/60 focus:border-teal-500 transition"
              >
                <option value="house">House</option>
                <option value="techno">Techno</option>
                <option value="hip-hop">Hip-Hop</option>
                <option value="trap">Trap</option>
                <option value="breakbeat">Breakbeat</option>
                <option value="dnb">Drum & Bass</option>
                <option value="latin">Latin</option>
                <option value="funk">Funk</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">BPM</label>
              <select
                value={bpm}
                onChange={(e) => setBpm(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500/60 focus:border-teal-500 transition"
              >
                <option value="70">70 (Slow / Deep)</option>
                <option value="90">90 (Downtempo)</option>
                <option value="110">110 (Mid-Tempo)</option>
                <option value="128">128 (Standard House)</option>
                <option value="140">140 (Techno / Trance)</option>
                <option value="160">160 (Drum & Bass)</option>
                <option value="175">175 (Jungle)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Complexity</label>
              <select
                value={complexity}
                onChange={(e) => setComplexity(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500/60 focus:border-teal-500 transition"
              >
                <option value="basic">Basic (4-on-the-floor)</option>
                <option value="moderate">Moderate</option>
                <option value="complex">Complex / Polyrhythmic</option>
                <option value="swing-heavy">Swing Heavy</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 text-lg shadow-lg shadow-teal-900/30"
          >
            {loading ? '⏳ Generating Pattern...' : '✨ Generate Drum Pattern'}
          </button>
        </div>

        {output && (
          <div className="bg-gray-800/40 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Drum Pattern</h2>
              <button
                onClick={() => navigator.clipboard.writeText(output)}
                className="text-sm text-teal-400 hover:text-teal-300 transition"
              >
                📋 Copy
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-gray-300 text-sm leading-relaxed font-mono bg-gray-900/50 rounded-xl p-4 border border-gray-700/50 overflow-x-auto">{output}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
