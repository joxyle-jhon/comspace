import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Logo from '@/components/layout/Logo'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        {/* Left Side: Brand Story Panel */}
        <div className="hidden lg:flex lg:col-span-5 bg-slate-900 text-white relative flex-col justify-between p-12 overflow-hidden">
          {/* Background Ambient Glow & Texture */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF5A1F]/20 via-slate-900 to-slate-950 z-0" />
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
            alt="Comfortable stay"
            fill
            className="object-cover opacity-20 mix-blend-overlay z-0"
            priority
          />

          {/* Top Logo */}
          <div className="relative z-10">
            <Link href="/" className="inline-block">
              <Logo size="lg" />
            </Link>
          </div>

          {/* Center Editorial Quote */}
          <div className="relative z-10 space-y-6 max-w-md">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-[#FF5A1F]">
              Handpicked Stays
            </span>
            <h1 className="font-heading text-3xl xl:text-4xl font-black leading-tight tracking-tight">
              Comfortable, peaceful spaces built for restful living.
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Join thousands of travelers enjoying verified luxury apartments, quiet villas, and seamless booking guarantees worldwide.
            </p>
          </div>

          {/* Bottom Footer Note */}
          <div className="relative z-10 text-[10px] font-medium text-slate-500 flex items-center justify-between border-t border-white/10 pt-6">
            <span>© Comspace Inc.</span>
            <span>Privacy & Terms</span>
          </div>
        </div>

        {/* Right Side: Auth Form Container */}
        <div className="lg:col-span-7 flex flex-col justify-center items-center p-6 sm:p-12 relative z-10">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
