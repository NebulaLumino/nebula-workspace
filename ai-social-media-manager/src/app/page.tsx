'use client'
import { useState } from 'react'
export default function Home() {
  const [topic, setTopic] = useState('')
  const [posts, setPosts] = useState('')
  const [loading, setLoading] = useState(false)
  const generate = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/posts', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ topic }) })
      const data = await res.json()
      setPosts(data.posts || '')
    } catch {}
    setLoading(false)
  }
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-white/10 p-4"><h1 className="text-xl text-white">AI Social Media Manager</h1></header>
      <main className="p-4 max-w-3xl mx-auto space-y-4">
        <input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="Topic..." className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2.5 text-white"/>
        <button onClick={generate} disabled={loading} className="w-full py-3 bg-primary rounded-lg font-medium">{loading ? 'Generating...' : 'Generate Posts'}</button>
        {posts && <pre className="whitespace-pre-wrap text-sm text-slate-300 bg-surface p-4 rounded-lg">{posts}</pre>}
      </main>
    </div>
  )
}
