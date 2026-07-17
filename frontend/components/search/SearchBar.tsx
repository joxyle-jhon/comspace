'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, MapPin, Calendar, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface SearchBarProps {
  className?: string
  compact?: boolean
}

const fieldInputClass =
  'h-auto border-0 bg-transparent px-0 py-0 shadow-none focus-visible:ring-0 md:text-sm'

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
      <Button
        type="button"
        variant="outline"
        onClick={() => router.push('/properties')}
        className="h-auto rounded-full px-4 py-2.5 text-sm font-normal text-stone-500 shadow-sm hover:shadow-md"
        aria-label="Open search"
      >
        <Search className="w-4 h-4 text-primary" aria-hidden="true" />
        Search destinations…
      </Button>
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
      <div
        className={cn(
          'flex items-center gap-3 px-5 py-4 flex-1 border-b md:border-b-0 md:border-r border-stone-100 cursor-text',
          activeField === 'location' && 'bg-stone-50'
        )}
        onClick={() => document.getElementById('search-location')?.focus()}
      >
        <MapPin className="w-5 h-5 text-primary shrink-0" aria-hidden="true" />
        <div className="flex-1">
          <Label htmlFor="search-location" className="text-xs font-semibold text-stone-700 mb-0.5">
            Where
          </Label>
          <Input
            id="search-location"
            type="text"
            placeholder="Search destinations"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onFocus={() => setActiveField('location')}
            onBlur={() => setActiveField(null)}
            onKeyDown={handleKeyDown}
            className={fieldInputClass}
          />
        </div>
      </div>

      <div
        className={cn(
          'flex items-center gap-3 px-5 py-4 flex-1 border-b md:border-b-0 md:border-r border-stone-100 cursor-text',
          activeField === 'checkin' && 'bg-stone-50'
        )}
      >
        <Calendar className="w-5 h-5 text-primary shrink-0" aria-hidden="true" />
        <div className="flex-1">
          <Label htmlFor="search-checkin" className="text-xs font-semibold text-stone-700 mb-0.5">
            Check in
          </Label>
          <Input
            id="search-checkin"
            type="date"
            value={checkIn}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setCheckIn(e.target.value)}
            onFocus={() => setActiveField('checkin')}
            onBlur={() => setActiveField(null)}
            className={cn(fieldInputClass, '[color-scheme:light]')}
          />
        </div>
      </div>

      <div
        className={cn(
          'flex items-center gap-3 px-5 py-4 flex-1 border-b md:border-b-0 md:border-r border-stone-100 cursor-text',
          activeField === 'checkout' && 'bg-stone-50'
        )}
      >
        <Calendar className="w-5 h-5 text-stone-400 shrink-0" aria-hidden="true" />
        <div className="flex-1">
          <Label htmlFor="search-checkout" className="text-xs font-semibold text-stone-700 mb-0.5">
            Check out
          </Label>
          <Input
            id="search-checkout"
            type="date"
            value={checkOut}
            min={checkIn || new Date().toISOString().split('T')[0]}
            onChange={(e) => setCheckOut(e.target.value)}
            onFocus={() => setActiveField('checkout')}
            onBlur={() => setActiveField(null)}
            className={cn(fieldInputClass, '[color-scheme:light]')}
          />
        </div>
      </div>

      <div
        className={cn(
          'flex items-center gap-3 px-5 py-4 flex-1',
          activeField === 'guests' && 'bg-stone-50'
        )}
      >
        <Users className="w-5 h-5 text-stone-400 shrink-0" aria-hidden="true" />
        <div className="flex-1">
          <Label htmlFor="search-guests" className="text-xs font-semibold text-stone-700 mb-0.5">
            Guests
          </Label>
          <Input
            id="search-guests"
            type="number"
            min={1}
            max={20}
            value={guests}
            onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value) || 1))}
            onFocus={() => setActiveField('guests')}
            onBlur={() => setActiveField(null)}
            className={fieldInputClass}
          />
        </div>
      </div>

      <div className="flex items-center p-3">
        <Button
          type="button"
          id="search-submit"
          size="xl"
          onClick={handleSearch}
          className="w-full md:w-auto whitespace-nowrap"
          aria-label="Search properties"
        >
          <Search className="w-4 h-4" aria-hidden="true" />
          Search
        </Button>
      </div>
    </motion.div>
  )
}
