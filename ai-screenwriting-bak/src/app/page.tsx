"use client";

import { useState } from "react";

export default function Home() {
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const formFields = `<div><label class="block text-sm font-medium text-gray-300 mb-1">Genre</label><select id="genre" name="genre" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:outline-none focus:border-violet-500 text-white"><option value="">Select</option><option>Drama</option><option>Thriller</option><option>Comedy</option><option>Horror</option><option>Sci-Fi</option><option>Romance</option><option>Action</option><option>Mystery</option><option>Noir</option></select></div><div><label class="block text-sm font-medium text-gray-300 mb-1">Logline *</label><textarea id="logline" name="logline" rows="3" placeholder="A compelling one-sentence summary..." class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:outline-none focus:border-violet-500 text-white placeholder-gray-500 resize-none"></textarea></div><div><label class="block text-sm font-medium text-gray-300 mb-1">Setting</label><input id="setting" name="setting" placeholder="Time period and location" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:outline-none focus:border-violet-500 text-white placeholder-gray-500"></div><div><label class="block text-sm font-medium text-gray-300 mb-1">Tone</label><select id="tone" name="tone" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:outline-none focus:border-violet-500 text-white"><option value="">Select</option><option>Dark & gritty</option><option>Light & comedic</option><option>Serious & dramatic</option><option>Whimsical</option><option>Noir</option></select></div><div><label class="block text-sm font-medium text-gray-300 mb-1">Format</label><select id="length" name="length" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:outline-none focus:border-violet-500 text-white"><option value="short">Short Film (5-15 min)</option><option value="feature">Feature Film (90-120 min)</option><option value="tv-episode">TV Episode (42 min)</option></select></div><div><label class="block text-sm font-medium text-gray-300 mb-1">Protagonist Archetype</label><input id="archetype" name="archetype" placeholder="e.g. The Rebel, The Mentor, The Hero" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:outline-none focus:border-violet-500 text-white placeholder-gray-500"></div>`;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form.entries()));
    setIsLoading(true); setOutput(""); setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Generation failed");
      setOutput(json.result);
    } catch (err: any) { setError(err.message); }
    finally { setIsLoading(false); }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <header className="mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent mb-2">AI Screenwriting</h1>
        </header>
        <div className="grid md:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit} className="space-y-4" dangerouslySetInnerHTML={{__html: formFields}} />
          <div>
            {error && <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-lg p-4 mb-4">{error}</div>}
            {isLoading && (
              <div className="bg-gray-800 rounded-xl p-8 text-center space-y-3">
                <div className="flex justify-center gap-2">
                  {[0,1,2].map(i => <span key={i} className={"w-3 h-3 text-violet-400 rounded-full animate-bounce"} style={{animationDelay: `${i*0.1}s`}} />)}
                </div>
                <p className="text-gray-400 text-sm">Generating...</p>
              </div>
            )}
            {output && (
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className={"text-sm font-semibold mb-3 " + "text-violet-400"}>Result</h3>
                <pre className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed max-h-[600px] overflow-y-auto">{output}</pre>
              </div>
            )}
            {!output && !isLoading && (
              <div className="bg-gray-800/50 rounded-xl p-8 text-center text-gray-500 border-2 border-dashed border-gray-700">
                <p>Output will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
