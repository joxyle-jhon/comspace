'use client'

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StatsSection from '@/components/home/StatsSection'
import WhyComspace from '@/components/home/WhyComspace'
import { ShieldCheck, HeartHandshake, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FDFBF9] pt-36 pb-24">
        {/* Editorial Header */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h1 className="font-heading text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
            Why <span className="gradient-text">Comspace</span> was created.
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Derived from <strong className="text-slate-900 font-bold">COMfortable SPACE</strong>, Comspace was built to redefine remote living and travel by offering verified, work-friendly rentals designed for creators, remote teams, and digital nomads worldwide.
          </p>
        </section>

        {/* Global Stats Counter */}
        <StatsSection />

        {/* Built for Remote Living Features */}
        <WhyComspace />

        {/* Additional Trust & Commitment Section */}
        <section className="py-20 bg-white border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Verified Platform Standard
                </div>
                <h2 className="font-heading text-3xl font-black text-slate-900 tracking-tight">
                  Every comfortable space comes with our quality promise.
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  We verify internet speed benchmarks, host identity profiles, and amenities before any stay is published on Comspace.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-xs font-bold text-slate-800">500Mbps+ Verified Fiber WiFi Options</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-xs font-bold text-slate-800">Direct 256-bit Encrypted Card Checkout</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-xs font-bold text-slate-800">24/7 Dedicated Nomad Support Team</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    href="/properties"
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-full gradient-bg text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#FF5A1F]/20 hover:shadow-lg transition-all"
                  >
                    Find Your Comfortable Space
                  </Link>
                </div>
              </div>

              {/* Graphic Card */}
              <div className="bg-[#FFF0EB] rounded-3xl p-8 border border-[#FF5A1F]/20 space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-white text-[#FF5A1F] flex items-center justify-center shadow-sm">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-black text-2xl text-slate-900">
                  Are you a space owner?
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Join thousands of verified hosts offering premium spaces to remote professionals worldwide. Enjoy 0% listing setup fees and $1M host liability coverage.
                </p>
                <Link
                  href="/host/become"
                  className="inline-block px-6 py-3 rounded-full bg-slate-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition-colors"
                >
                  Become a Host Today
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
