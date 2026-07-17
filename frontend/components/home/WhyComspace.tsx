'use client'

import { Shield, Zap, HeartHandshake, BadgeCheck } from 'lucide-react'

const FEATURES = [
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Every booking is protected by Stripe. Your payment is only released after check-in.',
    color: 'bg-brand-light/45 text-brand-primary',
  },
  {
    icon: Zap,
    title: 'Instant Confirmation',
    description: 'Many properties offer instant booking — no waiting, no back-and-forth messaging.',
    color: 'bg-brand-tertiary/25 text-brand-primary',
  },
  {
    icon: HeartHandshake,
    title: 'Verified Hosts',
    description: 'All hosts go through an identity verification process before listing their spaces.',
    color: 'bg-brand-light/45 text-brand-primary',
  },
  {
    icon: BadgeCheck,
    title: 'Quality Guaranteed',
    description: 'Our team reviews listings regularly to ensure descriptions match reality.',
    color: 'bg-brand-tertiary/25 text-brand-primary',
  },
] as const

export default function WhyComspace() {
  return (
    <section id="why-heading" aria-labelledby="why-title" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-brand-primary text-xs font-bold uppercase tracking-wider mb-2">Why Comspace</p>
          <h2
            id="why-title"
            className="font-heading text-3xl sm:text-4xl font-black text-slate-900 tracking-tight"
          >
            Travel and work with confidence
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map(({ icon: Icon, title, description, color }, idx) => (
            <div
              key={idx}
              className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col items-center text-center hover:bg-slate-100/50 transition-colors duration-300"
            >
              <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-6`}>
                <Icon className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="font-heading font-bold text-slate-900 text-lg mb-3">
                {title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
