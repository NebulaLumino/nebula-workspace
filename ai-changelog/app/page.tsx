'use client';

import { useState } from 'react';

export default function Home() {
  const [commits, setCommits] = useState('');
  const [version, setVersion] = useState('');
  const [style, setStyle] = useState('keepachangelog');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!commits.trim()) return;
    setLoading(true);
    setError('');
    setOutput('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commits, version, style }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      setOutput(data.output);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-violet-400 mb-3">📋 AI Changelog & Release Notes Generator</h1>
          <p className="text-gray-400 text-lg">Paste your git commits or change list, get a polished changelog instantly</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Git Commits / Changes</label>
            <textarea
              className="w-full h-72 bg-gray-800 border border-gray-700 rounded-xl p-4 text-gray-100 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder={'Paste commits or change descriptions...\n\nExample:\nfeat: add user authentication\nfix: resolve memory leak in cache\ndocs: update API documentation\nperf: optimize database queries\nBREAKING CHANGE: removed legacy v1 endpoints'}
              value={commits}
              onChange={e => setCommits(e.target.value)}
            />
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">New Version</label>
              <input
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="e.g. v2.1.0"
                value={version}
                onChange={e => setVersion(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Changelog Style</label>
              <select
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                value={style}
                onChange={e => setStyle(e.target.value)}
              >
                <option value="keepachangelog">Keep a Changelog</option>
                <option value="conventional">Conventional Commits</option>
                <option value="github">GitHub Releases</option>
                <option value="simple">Simple List</option>
              </select>
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading || !commits.trim()}
              className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {loading ? '⏳ Generating changelog...' : '📋 Generate Changelog'}
            </button>
            {error && <p className="text-red-400 text-sm">{error}</p>}
          </div>
        </div>

        {output && (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-violet-400">Generated Changelog</h2>
              <button
                onClick={copyOutput}
                className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-4 py-2 rounded-lg text-sm transition-colors"
              >
                📋 Copy
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-gray-200 font-mono bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
              {output}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
