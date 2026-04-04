import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    genre: '',
    logline: '',
    tone: 'dramatic',
    length: 'feature',
    setting: '',
    protagonist: '',
    conflict: ''
  });
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);

  const genres = ['Drama', 'Comedy', 'Thriller', 'Sci-Fi', 'Horror', 'Romance', 'Action', 'Documentary'];
  const tones = ['Dramatic', 'Dark Comedy', 'Light', 'Satirical', 'Serious', 'Whimsical'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate AI generation
    setTimeout(() => {
      setScript(`FADE IN:

INT. ${formData.setting || 'LOCATION'} - DAY

${formData.protagonist || 'PROTAGONIST'} enters the scene. ${formData.conflict || 'The conflict unfolds.'}

A professional screenplay generated for: ${formData.logline || formData.genre || 'Screenplay'}

This is a template. Connect an LLM API (DeepSeek, OpenAI) to generate full scripts.

FADE OUT.

THE END`);
      setLoading(false);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-violet-800 mb-2">🎬 AI Screenwriting</h1>
          <p className="text-violet-600">Generate professional screenplays with AI</p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
              <select 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-violet-500"
                value={formData.genre}
                onChange={(e) => setFormData({...formData, genre: e.target.value})}
              >
                <option value="">Select genre...</option>
                {genres.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logline</label>
              <input 
                type="text" 
                placeholder="A compelling one-sentence summary..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-violet-500"
                value={formData.logline}
                onChange={(e) => setFormData({...formData, logline: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
              <select 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-violet-500"
                value={formData.tone}
                onChange={(e) => setFormData({...formData, tone: e.target.value})}
              >
                {tones.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Setting</label>
              <input 
                type="text" 
                placeholder="Where does the story take place?"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-violet-500"
                value={formData.setting}
                onChange={(e) => setFormData({...formData, setting: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Protagonist</label>
              <input 
                type="text" 
                placeholder="Who is your main character?"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-violet-500"
                value={formData.protagonist}
                onChange={(e) => setFormData({...formData, protagonist: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Central Conflict</label>
              <input 
                type="text" 
                placeholder="What drives the story?"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-violet-500"
                value={formData.conflict}
                onChange={(e) => setFormData({...formData, conflict: e.target.value})}
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 text-white py-3 rounded-lg font-medium hover:bg-violet-700 disabled:opacity-50 transition"
            >
              {loading ? 'Generating...' : 'Generate Screenplay'}
            </button>
          </form>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Script</h2>
            {script ? (
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono bg-gray-50 p-4 rounded-lg max-h-[500px] overflow-y-auto">
                {script}
              </pre>
            ) : (
              <div className="text-gray-400 text-center py-12">
                Fill in the form and generate your screenplay
              </div>
            )}
          </div>
        </div>

        <footer className="text-center mt-8 text-gray-500 text-sm">
          AI Screenwriting App • Built with Next.js
        </footer>
      </div>
    </main>
  );
}