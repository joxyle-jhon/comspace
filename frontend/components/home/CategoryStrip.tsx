'use client'

import { Building2, Home, TreePine, Waves, Mountain, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  { label: 'Apartments', icon: Building2, type: 'apartment' },
  { label: 'Houses', icon: Home, type: 'house' },
  { label: 'Cabins', icon: TreePine, type: 'cabin' },
  { label: 'Villas', icon: Star, type: 'villa' },
  { label: 'Studios', icon: Waves, type: 'studio' },
  { label: 'Lofts', icon: Mountain, type: 'loft' },
] as const

interface CategoryStripProps {
  activeCategory: string | null
  onSelectCategory: (type: string | null) => void
}

export default function CategoryStrip({ activeCategory, onSelectCategory }: CategoryStripProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pt-2 pb-4 px-1 scrollbar-none justify-start mt-4 mb-6 relative z-[2]">
      {CATEGORIES.map(({ label, icon: Icon, type }) => {
        const isActive = activeCategory === type
        return (
          <button
            key={type}
            onClick={() => onSelectCategory(isActive ? null : type)}
            aria-pressed={isActive}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 border duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 overflow-visible',
              isActive
                ? 'bg-brand-primary text-white border-transparent shadow-[0_2px_12px_rgba(255,103,0,0.4)] ring-2 ring-brand-primary ring-offset-2'
                : 'bg-transparent border-brand-light text-slate-700 hover:bg-brand-tertiary hover:text-slate-900'
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{label}</span>
          </button>
        )
      })}
    </div>
  )
}
