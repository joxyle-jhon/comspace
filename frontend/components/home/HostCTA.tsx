'use client'

import Link from 'next/link'

export default function HostCTA() {
  return (
    <section id="host-banner" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80')",
          }}
          role="presentation"
        />
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]" />
        <div className="relative z-10 p-12 sm:p-20 text-center max-w-2xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-black text-white leading-none tracking-tight mb-4">
            Become a Host
          </h2>
          <p className="text-white/80 text-base sm:text-lg mb-8 leading-relaxed">
            Earn extra income by renting your property. Share your space with travelers from around the world and start earning today.
          </p>
          <Link
            href="/host/become"
            className="inline-block bg-white text-brand-primary hover:text-brand-secondary text-base font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-white/20 transition-all duration-300 transform hover:scale-[1.04] active:scale-[0.96]"
          >
            Start hosting
          </Link>
        </div>
      </div>
    </section>
  )
}
