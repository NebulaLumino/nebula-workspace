import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = { title: 'AI Social Media', description: 'Manage social media' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body className="antialiased">{children}</body></html>)
}
