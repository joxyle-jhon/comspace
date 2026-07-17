'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { SearchBar } from '@/components/search/SearchBar'

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=80')",
        }}
        role="presentation"
        aria-hidden="true"
      />
      {/* Gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-stone-950/60 via-stone-950/40 to-stone-950/80"
        aria-hidden="true"
      />

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 rounded-full bg-brand-500/10 blur-3xl"
            style={{ left: `${10 + i * 16}%`, top: `${20 + (i % 3) * 20}%` }}
            animate={prefersReducedMotion ? undefined : { y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={prefersReducedMotion ? undefined : { duration: 4 + i, repeat: Infinity, delay: i * 0.7 }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" aria-hidden="true" />
            10,000+ unique spaces worldwide
          </span>
        </motion.div>

        <motion.h1
          id="hero-heading"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
        >
          Find your{' '}
          <span className="gradient-text">perfect space</span>
          <br />
          anywhere in the world
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Handpicked homes, villas, and apartments for every kind of trip.
          Book with confidence — instant confirmations, no hidden fees.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <SearchBar className="max-w-4xl mx-auto" />
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-6 mt-10"
          aria-label="Platform highlights"
        >
          {[
            { value: '10K+', label: 'Properties' },
            { value: '50K+', label: 'Happy guests' },
            { value: '4.9', label: 'Avg. rating' },
            { value: '120+', label: 'Countries' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-white font-heading font-bold text-xl">{value}</p>
              <p className="text-white/60 text-xs">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={prefersReducedMotion ? undefined : { y: [0, 8, 0] }}
        transition={prefersReducedMotion ? undefined : { repeat: Infinity, duration: 2 }}
        aria-hidden="true"
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-white/60" />
        </div>
      </motion.div>
    </section>
  )
}
