'use client'

import { Home, Users, Star, Globe } from 'lucide-react'

const STATS = [
  {
    value: '10K+',
    label: 'Verified Spaces',
    icon: Home,
  },
  {
    value: '50K+',
    label: 'Nomad Travelers',
    icon: Users,
  },
  {
    value: '4.95',
    label: 'Average Rating',
    icon: Star,
  },
  {
    value: '120+',
    label: 'Global Cities',
    icon: Globe,
  },
]

export default function StatsSection() {
  return (
    <section aria-label="Trust statistics" className="py-20 bg-[#FDFBF9] border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {STATS.map(({ value, label, icon: Icon }, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FFF0EB] text-[#FF5A1F] flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 stroke-[1.8]" />
              </div>
              <p className="font-heading font-black text-3xl sm:text-4xl text-slate-900 mb-1 tracking-tight">
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
