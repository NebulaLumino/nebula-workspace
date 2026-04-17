'use client';

import { useState } from 'react';

export default function AudiobookNarrator() {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('fiction');
  const [length, setLength] = useState('medium');
  const [style, setStyle] = useState('warm');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!title.trim()) return;
    setLoading(true);
    setOutput('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, genre, length, style }),
      });
      const data = await res.json();
      setOutput(data.output || data.error || 'No response generated.');
    } catch {
      setOutput('Error: Failed to generate narration script.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">📖</div>
          <h1 className="text-3xl font-bold text-white mb-2">AI Audiobook Narrator</h1>
          <p className="text-gray-400">Generate audiobook narration scripts with character voices and pacing notes</p>
        </div>

        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Book Title / Summary *</label>
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., The Silent Stars — A sci-fi novel about humanity's last colony on Europa"
              rows={4}
              className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500 transition resize-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500 transition"
              >
                <option value="fiction">Fiction</option>
                <option value="non-fiction">Non-Fiction</option>
                <option value="fantasy">Fantasy</option>
                <option value="thriller">Thriller</option>
                <option value="romance">Romance</option>
                <option value="sci-fi">Sci-Fi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Book Length</label>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500 transition"
              >
                <option value="short">Short (<5 hrs)</option>
                <option value="medium">Medium (5-10 hrs)</option>
                <option value="long">Long (10-20 hrs)</option>
                <option value="epic">Epic (20+ hrs)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Narrator Style</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500 transition"
              >
                <option value="warm">Warm</option>
                <option value="authoritative">Authoritative</option>
                <option value="energetic">Energetic</option>
                <option value="mysterious">Mysterious</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !title.trim()}
            className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 text-lg shadow-lg shadow-red-900/30"
          >
            {loading ? '⏳ Generating Script...' : '✨ Generate Narration Script'}
          </button>
        </div>

        {output && (
          <div className="bg-gray-800/40 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Narration Script</h2>
              <button
                onClick={() => navigator.clipboard.writeText(output)}
                className="text-sm text-red-400 hover:text-red-300 transition"
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
