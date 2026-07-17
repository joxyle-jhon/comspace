'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import DateRangePicker from './DateRangePicker'
import GuestSelector from './GuestSelector'

interface SearchBarProps {
  className?: string
  onSearch?: (params: any) => void
}

export default function SearchBar({ className, onSearch }: SearchBarProps) {
  const router = useRouter()
  const [location, setLocation] = useState('')
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null,
  })
  
  // Guest counts
  const [adults, setAdults] = useState(1)
  const [kids, setKids] = useState(0)
  const [pets, setPets] = useState(0)

  const [activeField, setActiveField] = useState<string | null>(null)

  const formatDateString = (date: Date | null) => {
    if (!date) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    const checkInStr = formatDateString(dateRange.startDate)
    const checkOutStr = formatDateString(dateRange.endDate)
    const totalGuests = adults + kids + pets

    if (location) params.set('location', location)
    if (checkInStr) params.set('check_in', checkInStr)
    if (checkOutStr) params.set('check_out', checkOutStr)
    if (totalGuests > 1) params.set('guests', String(totalGuests))

    if (onSearch) {
      onSearch({
        location,
        checkIn: checkInStr,
        checkOut: checkOutStr,
        guests: totalGuests,
      })
    } else {
      router.push(`/properties?${params.toString()}`)
    }
  }

  return (
    <div
      className={cn(
        'w-full bg-white rounded-3xl md:rounded-full border border-slate-200/80 shadow-2xl p-3 flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-0 relative z-[10000]',
        className
      )}
      role="search"
    >
      {/* WHERE field */}
      <div
        className={cn(
          'flex-1 flex items-center gap-3 px-5 py-2.5 rounded-2xl md:rounded-l-full cursor-pointer hover:bg-slate-50 transition-colors group',
          activeField === 'location' && 'bg-slate-50'
        )}
        onClick={() => {
          setActiveField('location')
          document.getElementById('search-location')?.focus()
        }}
      >
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-brand-light group-hover:text-brand-primary transition-colors shrink-0">
          <MapPin className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col text-left">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">
            WHERE
          </span>
          <input
            id="search-location"
            type="text"
            placeholder="Anywhere"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onFocus={() => setActiveField('location')}
            onBlur={() => setTimeout(() => setActiveField(null), 200)}
            className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:ring-0 focus:outline-none"
          />
        </div>
      </div>

      <div className="hidden md:block h-8 w-px bg-slate-200" />

      {/* DATE RANGE field */}
      <DateRangePicker value={dateRange} onChange={setDateRange} />

      <div className="hidden md:block h-8 w-px bg-slate-200" />

      {/* WHO field */}
      <GuestSelector
        adults={adults}
        setAdults={setAdults}
        kids={kids}
        setKids={setKids}
        pets={pets}
        setPets={setPets}
      />

      {/* Search button */}
      <button
        onClick={handleSearch}
        className="gradient-bg text-white h-14 w-full md:w-14 rounded-2xl md:rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-brand-primary/30 transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.97] shrink-0 gap-2 md:gap-0 font-bold"
        aria-label="Search properties"
      >
        <Search className="w-5 h-5" />
        <span className="md:hidden">Search Spaces</span>
      </button>
    </div>
  )
}
