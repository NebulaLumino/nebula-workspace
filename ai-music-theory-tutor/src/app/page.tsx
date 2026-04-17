'use client';

import { useState } from 'react';

export default function MusicTheoryTutor() {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('intermediate');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setOutput('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, level }),
      });
      const data = await res.json();
      setOutput(data.output || data.error || 'No response generated.');
    } catch {
      setOutput('Error: Failed to generate lesson.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">🎓</div>
          <h1 className="text-3xl font-bold text-white mb-2">AI Music Theory Tutor</h1>
          <p className="text-gray-400">Interactive music theory lessons with chord/scale explanations and ear training tips</p>
        </div>

        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Topic / Concept *</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Circle of fifths, Modal interchange, Tritone substitution, Polyrhythms"
              className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/60 focus:border-cyan-500 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Lesson Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/60 focus:border-cyan-500 transition"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Quick Topics</label>
              <div className="flex flex-wrap gap-2">
                {['Circle of 5ths', 'Modes', 'Sus Chords', 'Voice Leading'].map(t => (
                  <button
                    key={t}
                    onClick={() => setTopic(t)}
                    className="px-3 py-1.5 text-xs bg-gray-700/60 hover:bg-gray-600/60 rounded-lg text-gray-300 border border-gray-600 transition"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !topic.trim()}
            className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 text-lg shadow-lg shadow-cyan-900/30"
          >
            {loading ? '⏳ Teaching...' : '✨ Start Lesson'}
          </button>
        </div>

        {output && (
          <div className="bg-gray-800/40 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Theory Lesson</h2>
              <button
                onClick={() => navigator.clipboard.writeText(output)}
                className="text-sm text-cyan-400 hover:text-cyan-300 transition"
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
