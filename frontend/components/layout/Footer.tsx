'use client'

import Link from 'next/link'
import { Home } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200/50 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white">
              <div className="w-3 h-3 bg-white transform rotate-45" />
            </span>
            <span className="font-heading font-black text-lg tracking-tight text-slate-900">
              COM<span className="gradient-text">SPACE</span>
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-slate-500 font-medium">
            <Link href="/" className="hover:text-slate-900 transition-colors">Explore</Link>
            <Link href="/#why-heading" className="hover:text-slate-900 transition-colors">About</Link>
            <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy</Link>
          </div>

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} COMSPACE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
