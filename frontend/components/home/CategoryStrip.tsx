'use client'

import { Sparkles, Building2, Home, TreePine, Mountain, Laptop, Palmtree } from 'lucide-react'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  { label: 'All Spaces', icon: Sparkles, type: null, count: '100+' },
  { label: 'Nomad Hubs', icon: Laptop, type: 'studio', count: '24' },
  { label: 'Luxury Villas', icon: Palmtree, type: 'villa', count: '18' },
  { label: 'Modern Apartments', icon: Building2, type: 'apartment', count: '32' },
  { label: 'Cozy Cabins', icon: TreePine, type: 'cabin', count: '15' },
  { label: 'Urban Lofts', icon: Mountain, type: 'loft', count: '21' },
  { label: 'Private Homes', icon: Home, type: 'house', count: '12' },
] as const

interface CategoryStripProps {
  activeCategory: string | null
  onSelectCategory: (type: string | null) => void
}

export default function CategoryStrip({ activeCategory, onSelectCategory }: CategoryStripProps) {
  return (
    <div className="relative z-10 mb-10">
      <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-1 px-1 scrollbar-none no-scrollbar">
        {CATEGORIES.map(({ label, icon: Icon, type, count }) => {
          const isActive = activeCategory === type
          return (
            <button
              key={label}
              type="button"
              onClick={() => onSelectCategory(type)}
              aria-pressed={isActive}
              className={cn(
                'group flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-bold transition-all duration-300 shrink-0 border cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF5A1F] focus:ring-offset-2',
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/10 scale-[1.02]'
                  : 'bg-white border-slate-200/90 text-slate-700 hover:bg-[#FFF0EB] hover:text-[#FF5A1F] hover:border-[#FF5A1F]/40 shadow-sm'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 shrink-0 transition-transform group-hover:scale-110',
                  isActive ? 'text-[#FF5A1F]' : 'text-slate-400 group-hover:text-[#FF5A1F]'
                )}
              />
              <span>{label}</span>
              <span
                className={cn(
                  'text-[10px] font-black tracking-wider px-2 py-0.5 rounded-full transition-colors',
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'bg-slate-100 text-slate-500 group-hover:bg-[#FF5A1F]/15 group-hover:text-[#FF5A1F]'
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

