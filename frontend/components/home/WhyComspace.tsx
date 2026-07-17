'use client'

import { motion } from 'framer-motion'
import { Shield, Zap, HeartHandshake, BadgeCheck } from 'lucide-react'

const FEATURES = [
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Every booking is protected by Stripe. Your payment is only released after check-in.',
    color: 'bg-teal-50 text-teal-600',
  },
  {
    icon: Zap,
    title: 'Instant Confirmation',
    description: 'Many properties offer instant booking — no waiting, no back-and-forth messaging.',
    color: 'bg-brand-50 text-brand-500',
  },
  {
    icon: HeartHandshake,
    title: 'Verified Hosts',
    description: 'All hosts go through an identity verification process before listing their spaces.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: BadgeCheck,
    title: 'Quality Guaranteed',
    description: 'Our team reviews listings regularly to ensure descriptions match reality.',
    color: 'bg-amber-50 text-amber-600',
  },
] as const

export function WhyComspace() {
  return (
    <section aria-labelledby="why-heading" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-brand-500 text-sm font-semibold uppercase tracking-wide mb-2">Why Comspace</p>
          <h2
            id="why-heading"
            className="font-heading text-3xl sm:text-4xl font-bold text-stone-900"
          >
            Travel with confidence
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map(({ icon: Icon, title, description, color }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col items-start"
            >
              <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="font-heading font-semibold text-stone-900 mb-2">{title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
