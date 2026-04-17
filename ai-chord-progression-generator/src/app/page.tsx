'use client';

import { useState } from 'react';

export default function ChordProgressionGenerator() {
  const [mood, setMood] = useState('melancholic');
  const [genre, setGenre] = useState('pop');
  const [key, setKey] = useState('C major');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setOutput('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, genre, key }),
      });
      const data = await res.json();
      setOutput(data.output || data.error || 'No response generated.');
    } catch {
      setOutput('Error: Failed to generate chord progression.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">🎹</div>
          <h1 className="text-3xl font-bold text-white mb-2">AI Chord Progression Generator</h1>
          <p className="text-gray-400">Generate chord progressions with roman numeral analysis and voice leading tips</p>
        </div>

        <div className="space-y-6 mb-8">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mood</label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-violet-500 transition"
              >
                <option value="melancholic">Melancholic</option>
                <option value="uplifting">Uplifting</option>
                <option value="tense">Tense / Dramatic</option>
                <option value="chill">Chill / Relaxed</option>
                <option value="mysterious">Mysterious</option>
                <option value="romantic">Romantic</option>
                <option value="dark">Dark / Epic</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-violet-500 transition"
              >
                <option value="pop">Pop</option>
                <option value="jazz">Jazz</option>
                <option value="rock">Rock</option>
                <option value="folk">Folk</option>
                <option value="r&b">R&B / Neo-Soul</option>
                <option value="classical">Classical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Key</label>
              <select
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-violet-500 transition"
              >
                <option value="C major">C Major</option>
                <option value="G major">G Major</option>
                <option value="D major">D Major</option>
                <option value="A major">A Major</option>
                <option value="E major">E Major</option>
                <option value="A minor">A Minor</option>
                <option value="E minor">E Minor</option>
                <option value="D minor">D Minor</option>
                <option value="any">Any (Surprise me)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 text-lg shadow-lg shadow-violet-900/30"
          >
            {loading ? '⏳ Generating Progression...' : '✨ Generate Chord Progression'}
          </button>
        </div>

        {output && (
          <div className="bg-gray-800/40 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Chord Progression</h2>
              <button
                onClick={() => navigator.clipboard.writeText(output)}
                className="text-sm text-violet-400 hover:text-violet-300 transition"
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
