'use client';
import { useState } from 'react';
export default function TTSVoiceCloning() {
  const [text, setText] = useState('');
  const [useCase, setUseCase] = useState('podcast');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const handleGenerate = async () => {
    if (!text.trim()) return;
    setLoading(true); setOutput('');
    try {
      const res = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, useCase }) });
      const data = await res.json();
      setOutput(data.output || data.error || 'No response generated.');
    } catch { setOutput('Error: Failed to generate content.'); }
    setLoading(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12"><div className="text-5xl mb-4">🎤🔊</div><h1 className="text-3xl font-bold text-white mb-2">Text-to-Speech vs Voice Cloning</h1><p className="text-gray-400">Compare TTS and neural voice cloning technologies for podcasting and content creation</p></div>
        <div className="space-y-6 mb-8">
          <div><label className="block text-sm font-medium text-gray-300 mb-2">Use Case or Question *</label><textarea value={text} onChange={e => setText(e.target.value)} placeholder="e.g., How can voice cloning help me scale my podcast to 3 languages?" rows={4} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/60 focus:border-pink-500 transition resize-none" /></div>
          <div><label className="block text-sm font-medium text-gray-300 mb-2">Primary Use Case</label>
            <select value={useCase} onChange={e => setUseCase(e.target.value)} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500/60 focus:border-pink-500 transition">
              <option value="podcast">Podcast Production</option><option value="audiobook">Audiobook Narration</option><option value="video">Video Narration</option><option value="accessibility">Accessibility / Assistive Tech</option><option value="localization">Multilingual Localization</option>
            </select></div>
          <button onClick={handleGenerate} disabled={loading || !text.trim()} className="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 text-lg shadow-lg shadow-pink-900/30">{loading ? '⏳ Generating...' : '✨ Compare TTS Options'}</button>
        </div>
        {output && <div className="bg-gray-800/40 border border-gray-700 rounded-2xl p-6"><div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold text-white">Comparison Guide</h2><button onClick={() => navigator.clipboard.writeText(output)} className="text-sm text-pink-400 hover:text-pink-300 transition">📋 Copy</button></div><pre className="whitespace-pre-wrap text-gray-300 text-sm leading-relaxed font-mono bg-gray-900/50 rounded-xl p-4 border border-gray-700/50 overflow-x-auto">{output}</pre></div>}
      </div>
    </div>
  );
}
