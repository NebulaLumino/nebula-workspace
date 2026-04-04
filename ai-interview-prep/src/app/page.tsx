'use client'
import { useState } from 'react'
export default function Home() {
  const [role, setRole] = useState('Software Engineer')
  const [questions, setQuestions] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const generate = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/questions', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ role }) })
      const data = await res.json()
      if (data.questions) setQuestions(data.questions)
    } catch (e) { }
    setIsLoading(false)
  }
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-white/10 p-4"><div className="max-w-3xl mx-auto"><h1 className="text-xl text-white">AI Interview Prep</h1></div></header>
      <main className="max-w-3xl mx-auto p-4">
        <div className="bg-surface rounded-xl p-6 border border-white/5 space-y-4">
          <input value={role} onChange={e=>setRole(e.target.value)} className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white"/>
          <button onClick={generate} disabled={isLoading} className="w-full py-3 bg-primary rounded-lg font-medium">{isLoading ? 'Generating...' : 'Get Questions'}</button>
        </div>
        {questions && <div className="bg-surface rounded-xl p-6 border border-white/5 mt-6"><pre className="whitespace-pre-wrap text-sm text-slate-300">{questions}</pre></div>}
      </main>
    </div>
  )
}
