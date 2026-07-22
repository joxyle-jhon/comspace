'use client'

import { useState, useEffect, useRef } from 'react'
import { Users, Plus, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GuestSelectorProps {
  adults: number
  setAdults: (val: number) => void
  kids: number
  setKids: (val: number) => void
  pets: number
  setPets: (val: number) => void
}

export default function GuestSelector({
  adults,
  setAdults,
  kids,
  setKids,
  pets,
  setPets,
}: GuestSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const totalGuests = adults + kids + pets
  const guestLabel = totalGuests === 1 ? '1 guest' : `${totalGuests} guests`

  return (
    <div className="relative flex-1" ref={dropdownRef}>
      {/* Trigger display */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center gap-3 px-5 py-2.5 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors group',
          isOpen && 'bg-slate-50'
        )}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-brand-light group-hover:text-brand-primary transition-colors shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0 flex flex-col text-left">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">
              WHO
            </span>
            <span className="text-sm font-semibold text-slate-800 block truncate">
              {guestLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Guest Dropdown */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-3 w-80 animate-in rounded-3xl border border-slate-100 bg-white p-5 shadow-2xl fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-6">
            {/* Adults */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-heading font-bold text-slate-800 text-sm">Adults</p>
                <p className="text-xs text-slate-400 font-medium">Age 13+</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                  disabled={adults <= 1}
                  className="w-8 h-8 rounded-full border border-slate-200 hover:border-brand-primary hover:bg-brand-light/35 text-slate-600 hover:text-brand-primary active:scale-90 flex items-center justify-center disabled:opacity-20 disabled:hover:border-slate-200 disabled:hover:bg-transparent disabled:hover:text-slate-600 transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-6 text-center text-sm font-bold text-slate-800">{adults}</span>
                <button
                  type="button"
                  onClick={() => setAdults(Math.min(10, adults + 1))}
                  disabled={adults >= 10}
                  className="w-8 h-8 rounded-full border border-slate-200 hover:border-brand-primary hover:bg-brand-light/35 text-slate-600 hover:text-brand-primary active:scale-90 flex items-center justify-center text-slate-600 disabled:opacity-20 disabled:hover:border-slate-200 disabled:hover:bg-transparent disabled:hover:text-slate-600 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Kids */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-heading font-bold text-slate-800 text-sm">Kids</p>
                <p className="text-xs text-slate-400 font-medium">Age 2-12</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setKids(Math.max(0, kids - 1))}
                  disabled={kids <= 0}
                  className="w-8 h-8 rounded-full border border-slate-200 hover:border-brand-primary hover:bg-brand-light/35 text-slate-600 hover:text-brand-primary active:scale-90 flex items-center justify-center disabled:opacity-20 disabled:hover:border-slate-200 disabled:hover:bg-transparent disabled:hover:text-slate-600 transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-6 text-center text-sm font-bold text-slate-800">{kids}</span>
                <button
                  type="button"
                  onClick={() => setKids(Math.min(8, kids + 1))}
                  disabled={kids >= 8}
                  className="w-8 h-8 rounded-full border border-slate-200 hover:border-brand-primary hover:bg-brand-light/35 text-slate-600 hover:text-brand-primary active:scale-90 flex items-center justify-center text-slate-600 disabled:opacity-20 disabled:hover:border-slate-200 disabled:hover:bg-transparent disabled:hover:text-slate-600 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Pets */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-heading font-bold text-slate-800 text-sm">Pets</p>
                <p className="text-xs text-slate-400 font-medium">Service animals</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPets(Math.max(0, pets - 1))}
                  disabled={pets <= 0}
                  className="w-8 h-8 rounded-full border border-slate-200 hover:border-brand-primary hover:bg-brand-light/35 text-slate-600 hover:text-brand-primary active:scale-90 flex items-center justify-center disabled:opacity-20 disabled:hover:border-slate-200 disabled:hover:bg-transparent disabled:hover:text-slate-600 transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-6 text-center text-sm font-bold text-slate-800">{pets}</span>
                <button
                  type="button"
                  onClick={() => setPets(Math.min(5, pets + 1))}
                  disabled={pets >= 5}
                  className="w-8 h-8 rounded-full border border-slate-200 hover:border-brand-primary hover:bg-brand-light/35 text-slate-600 hover:text-brand-primary active:scale-90 flex items-center justify-center text-slate-600 disabled:opacity-20 disabled:hover:border-slate-200 disabled:hover:bg-transparent disabled:hover:text-slate-600 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Done CTA */}
            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 rounded-full gradient-bg text-white text-xs font-bold uppercase tracking-wider hover:shadow-md transition-shadow"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
