'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Building2, Home, TreePine, Waves, Mountain, Star } from 'lucide-react'

const CATEGORIES = [
  { label: 'Apartments', icon: Building2, type: 'apartment', color: 'bg-teal-50 text-teal-600' },
  { label: 'Houses', icon: Home, type: 'house', color: 'bg-amber-50 text-amber-600' },
  { label: 'Cabins', icon: TreePine, type: 'cabin', color: 'bg-green-50 text-green-600' },
  { label: 'Villas', icon: Star, type: 'villa', color: 'bg-purple-50 text-purple-600' },
  { label: 'Beachfront', icon: Waves, type: 'studio', color: 'bg-blue-50 text-blue-600' },
  { label: 'Mountain', icon: Mountain, type: 'loft', color: 'bg-stone-100 text-stone-600' },
] as const

export function CategoryStrip() {
  return (
    <section aria-labelledby="category-heading" className="py-12 bg-white border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="category-heading" className="sr-only">Browse by category</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
          {CATEGORIES.map(({ label, icon: Icon, type, color }, i) => (
            <motion.div
              key={type}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="snap-start shrink-0"
            >
              <Link
                href={`/properties?type=${type}`}
                className="flex flex-col items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-xl p-1"
              >
                <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center transition-transform group-hover:scale-110 group-hover:shadow-md`}>
                  <Icon className="w-7 h-7" aria-hidden="true" />
                </div>
                <span className="text-xs font-medium text-stone-600 group-hover:text-stone-900 transition-colors whitespace-nowrap">
                  {label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
