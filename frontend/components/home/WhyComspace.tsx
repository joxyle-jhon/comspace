'use client'

import { Shield, Zap, HeartHandshake, BadgeCheck } from 'lucide-react'

const FEATURES = [
  {
    icon: Shield,
    title: 'Protected Payments',
    description: 'Every reservation is protected by encrypted checkout. Payment is held securely until after check-in.',
  },
  {
    icon: Zap,
    title: 'Instant Reservation',
    description: 'Book verified work-friendly stays instantly without waiting for host back-and-forth.',
  },
  {
    icon: HeartHandshake,
    title: 'Verified Hosts',
    description: 'All hosts complete identity verification before listing their spaces on Comspace.',
  },
  {
    icon: BadgeCheck,
    title: 'High-Speed WiFi Guarantee',
    description: 'Every stay is verified for fast internet speeds so you can work, stream, and create uninterrupted.',
  },
] as const

export default function WhyComspace() {
  return (
    <section id="why-heading" aria-labelledby="why-title" className="py-24 bg-[#FDFBF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-[#FF5A1F] text-xs font-black uppercase tracking-wider mb-2">Built for Remote Living</p>
          <h2
            id="why-title"
            className="font-heading text-3xl sm:text-4xl font-black text-slate-900 tracking-tight"
          >
            Travel & work with complete peace of mind
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map(({ icon: Icon, title, description }, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center hover:border-slate-300 transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FFF0EB] text-[#FF5A1F] flex items-center justify-center mb-6">
                <Icon className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="font-heading font-bold text-slate-900 text-lg mb-3">
                {title}
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
