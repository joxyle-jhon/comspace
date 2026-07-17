'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, MapPin, Calendar, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  className?: string
  compact?: boolean
}

export function SearchBar({ className, compact = false }: SearchBarProps) {
  const router = useRouter()
  const [location, setLocation] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)
  const [activeField, setActiveField] = useState<string | null>(null)

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams()
    if (location) params.set('location', location)
    if (checkIn) params.set('check_in', checkIn)
    if (checkOut) params.set('check_out', checkOut)
    if (guests > 1) params.set('guests', String(guests))
    router.push(`/properties?${params.toString()}`)
  }, [location, checkIn, checkOut, guests, router])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  if (compact) {
    return (
      <button
        onClick={() => router.push('/properties')}
        className="flex items-center gap-3 px-4 py-2.5 rounded-full border border-stone-200 bg-white shadow-sm hover:shadow-md transition-all text-sm text-stone-500"
        aria-label="Open search"
      >
        <Search className="w-4 h-4 text-brand-500" aria-hidden="true" />
        <span>Search destinations…</span>
      </button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={cn(
        'flex flex-col md:flex-row items-stretch bg-white rounded-2xl shadow-booking overflow-hidden border border-stone-100',
        className
      )}
      role="search"
      aria-label="Property search"
    >
      {/* Location */}
      <div
        className={cn(
          'flex items-center gap-3 px-5 py-4 flex-1 border-b md:border-b-0 md:border-r border-stone-100 cursor-text',
          activeField === 'location' && 'bg-stone-50'
        )}
        onClick={() => document.getElementById('search-location')?.focus()}
      >
        <MapPin className="w-5 h-5 text-brand-500 shrink-0" aria-hidden="true" />
        <div className="flex-1">
          <label htmlFor="search-location" className="block text-xs font-semibold text-stone-700 mb-0.5">
            Where
          </label>
          <input
            id="search-location"
            type="text"
            placeholder="Search destinations"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onFocus={() => setActiveField('location')}
            onBlur={() => setActiveField(null)}
            onKeyDown={handleKeyDown}
            className="w-full text-sm text-stone-800 placeholder-stone-400 bg-transparent outline-none"
            aria-label="Destination"
          />
        </div>
      </div>

      {/* Check-in */}
      <div
        className={cn(
          'flex items-center gap-3 px-5 py-4 flex-1 border-b md:border-b-0 md:border-r border-stone-100 cursor-text',
          activeField === 'checkin' && 'bg-stone-50'
        )}
      >
        <Calendar className="w-5 h-5 text-brand-500 shrink-0" aria-hidden="true" />
        <div className="flex-1">
          <label htmlFor="search-checkin" className="block text-xs font-semibold text-stone-700 mb-0.5">
            Check in
          </label>
          <input
            id="search-checkin"
            type="date"
            value={checkIn}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setCheckIn(e.target.value)}
            onFocus={() => setActiveField('checkin')}
            onBlur={() => setActiveField(null)}
            className="w-full text-sm text-stone-800 bg-transparent outline-none [color-scheme:light]"
            aria-label="Check-in date"
          />
        </div>
      </div>

      {/* Check-out */}
      <div
        className={cn(
          'flex items-center gap-3 px-5 py-4 flex-1 border-b md:border-b-0 md:border-r border-stone-100 cursor-text',
          activeField === 'checkout' && 'bg-stone-50'
        )}
      >
        <Calendar className="w-5 h-5 text-stone-400 shrink-0" aria-hidden="true" />
        <div className="flex-1">
          <label htmlFor="search-checkout" className="block text-xs font-semibold text-stone-700 mb-0.5">
            Check out
          </label>
          <input
            id="search-checkout"
            type="date"
            value={checkOut}
            min={checkIn || new Date().toISOString().split('T')[0]}
            onChange={(e) => setCheckOut(e.target.value)}
            onFocus={() => setActiveField('checkout')}
            onBlur={() => setActiveField(null)}
            className="w-full text-sm text-stone-800 bg-transparent outline-none [color-scheme:light]"
            aria-label="Check-out date"
          />
        </div>
      </div>

      {/* Guests */}
      <div
        className={cn(
          'flex items-center gap-3 px-5 py-4 flex-1',
          activeField === 'guests' && 'bg-stone-50'
        )}
      >
        <Users className="w-5 h-5 text-stone-400 shrink-0" aria-hidden="true" />
        <div className="flex-1">
          <label htmlFor="search-guests" className="block text-xs font-semibold text-stone-700 mb-0.5">
            Guests
          </label>
          <input
            id="search-guests"
            type="number"
            min={1}
            max={20}
            value={guests}
            onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value) || 1))}
            onFocus={() => setActiveField('guests')}
            onBlur={() => setActiveField(null)}
            className="w-full text-sm text-stone-800 bg-transparent outline-none"
            aria-label="Number of guests"
          />
        </div>
      </div>

      {/* Search button */}
      <div className="flex items-center p-3">
        <button
          id="search-submit"
          onClick={handleSearch}
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm transition-colors w-full md:w-auto whitespace-nowrap"
          aria-label="Search properties"
        >
          <Search className="w-4 h-4" aria-hidden="true" />
          <span>Search</span>
        </button>
      </div>
    </motion.div>
  )
}
