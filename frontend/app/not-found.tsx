'use client'

import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { MapPinOff, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FDFBF9] pt-36 pb-24 flex items-center justify-center">
        <div className="max-w-lg mx-auto px-4 text-center space-y-6">
          {/* Animated 404 Icon Badge */}
          <div className="w-24 h-24 rounded-3xl bg-[#FFF0EB] border border-[#FF5A1F]/20 text-[#FF5A1F] mx-auto flex items-center justify-center shadow-lg shadow-[#FF5A1F]/10 animate-bounce">
            <MapPinOff className="w-12 h-12" />
          </div>

          <div>
            <span className="inline-block text-[10px] font-black uppercase tracking-wider text-[#FF5A1F] px-3 py-1 rounded-full bg-[#FFF0EB] mb-3">
              Error 404 — Page Not Found
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              This space isn&apos;t <br />
              <span className="gradient-text">on the map</span>.
            </h1>
          </div>

          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
            The page or stay you are looking for might have been moved, renamed, or is currently unavailable.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/properties"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full gradient-bg text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#FF5A1F]/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              Browse All Stays
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-slate-200 bg-white text-slate-800 font-bold text-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Return Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
