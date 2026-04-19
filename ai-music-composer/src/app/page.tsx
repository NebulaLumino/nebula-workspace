'use client';
import { useState } from 'react';

export default function Home() {
  const [mood, setMood] = useState('');
  const [genre, setGenre] = useState('Electronic');
  const [instruments, setInstruments] = useState('Synthesizers, Drums');
  const [tempo, setTempo] = useState('120 BPM');
  const [duration, setDuration] = useState('3-4 minutes');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOutput('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, genre, instruments, tempo, duration }),
      });
      const data = await res.json();
      setOutput(data.result || data.error || 'No response generated.');
    } catch (e: any) {
      setOutput('Error: ' + e.message);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white font-sans">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-500/30 mb-6">
            <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI Music Composer
          </h1>
          <p className="text-gray-400 text-lg">Generate melodies, chord progressions & full composition plans</p>
        </header>

        <form onSubmit={handleGenerate} className="space-y-5 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Mood / Emotion</label>
            <input value={mood} onChange={e => setMood(e.target.value)} placeholder="e.g. Uplifting, Melancholic, Energetic" required
              className="w-full bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
              <select value={genre} onChange={e => setGenre(e.target.value)}
                className="w-full bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors">
                {['Electronic', 'Ambient', 'Classical', 'Jazz', 'Rock', 'Pop', 'Hip-Hop', 'Cinematic', 'Lo-fi', 'Funk', 'R&B', 'Experimental'].map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tempo</label>
              <input value={tempo} onChange={e => setTempo(e.target.value)} placeholder="e.g. 120 BPM"
                className="w-full bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Instruments</label>
              <input value={instruments} onChange={e => setInstruments(e.target.value)} placeholder="e.g. Synths, Drums, Bass"
                className="w-full bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
              <input value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g. 3-4 minutes"
                className="w-full bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors" />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-4 rounded-xl font-semibold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.01] active:scale-[0.99]">
            {loading ? '🎵 Composing...' : '🎵 Compose Music'}
          </button>
        </form>

        {output && (
          <div className="bg-gray-800/40 border border-gray-700 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-3">Composition</h3>
            <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono leading-relaxed">{output}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
