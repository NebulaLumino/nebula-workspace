'use client'
import { useState } from 'react'
export default function Home() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [fix, setFix] = useState('')
  const [loading, setLoading] = useState(false)
  const debug = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/debug', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ code, error }) })
      const data = await res.json()
      setFix(data.fix || '')
    } catch {}
    setLoading(false)
  }
  return (
    <div className="min-h-screen bg-background p-4">
      <h1 className="text-xl text-white mb-4">AI Code Debugger Pro</h1>
      <textarea value={code} onChange={e=>setCode(e.target.value)} placeholder="Code..." className="w-full h-32 bg-surface border border-white/10 rounded-lg p-3 text-white font-mono text-sm mb-2"/>
      <input value={error} onChange={e=>setError(e.target.value)} placeholder="Error message..." className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 text-white text-sm mb-2"/>
      <button onClick={debug} disabled={loading} className="w-full py-3 bg-primary rounded-lg font-medium">{loading ? 'Debugging...' : 'Debug'}</button>
      {fix && <pre className="mt-4 whitespace-pre-wrap text-sm text-green-400 bg-surface p-4 rounded-lg">{fix}</pre>}
    </div>
  )
}
