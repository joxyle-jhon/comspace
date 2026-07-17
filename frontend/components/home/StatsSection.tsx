'use client'

import { Home, Users, Star, Globe } from 'lucide-react'

const STATS = [
  {
    value: '10K+',
    label: 'Spaces Listed',
    icon: Home,
    bg: 'bg-brand-light/45 text-brand-primary',
  },
  {
    value: '50K+',
    label: 'Happy Guests',
    icon: Users,
    bg: 'bg-brand-tertiary/25 text-brand-primary',
  },
  {
    value: '4.9',
    label: 'Average Rating',
    icon: Star,
    bg: 'bg-brand-light/45 text-brand-primary',
  },
  {
    value: '120+',
    label: 'Countries Active',
    icon: Globe,
    bg: 'bg-brand-tertiary/25 text-brand-primary',
  },
]

export default function StatsSection() {
  return (
    <section aria-label="Trust statistics" className="py-20 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {STATS.map(({ value, label, icon: Icon, bg }, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-3xl border border-slate-200/50 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow duration-300"
            >
              <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 stroke-[1.8]" />
              </div>
              <p className="font-heading font-black text-3xl text-slate-900 mb-1">
                {value}
              </p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
