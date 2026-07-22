'use client'

import { Sparkles, Building2, Home, TreePine, Waves, Mountain, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  { label: 'All Stays', icon: Sparkles, type: null },
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
    <div className="flex gap-2.5 overflow-x-auto pt-2 pb-4 px-1 scrollbar-none justify-start mb-8 relative z-[2]">
      {CATEGORIES.map(({ label, icon: Icon, type }) => {
        const isActive = activeCategory === type
        return (
          <button
            key={label}
            type="button"
            onClick={() => onSelectCategory(type)}
            aria-pressed={isActive}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 border duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF5A1F] focus:ring-offset-2',
              isActive
                ? 'gradient-bg text-white border-transparent shadow-md shadow-[#FF5A1F]/20'
                : 'bg-white border-slate-200/80 text-slate-700 hover:bg-[#FFF0EB] hover:text-[#FF5A1F] hover:border-[#FF5A1F]/30'
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
