import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = { title: 'AI Interview Prep', description: 'Practice interviews' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body className="antialiased">{children}</body></html>)
}
