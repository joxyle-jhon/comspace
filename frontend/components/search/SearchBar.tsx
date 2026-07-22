'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import DateRangePicker from './DateRangePicker'
import GuestSelector from './GuestSelector'

export interface PropertySearchValues {
  location: string
  checkIn: string
  checkOut: string
  guests: number
}

interface SearchBarProps {
  className?: string
  initialValues?: Partial<PropertySearchValues>
  onSearch?: (params: PropertySearchValues) => void
}

function parseDate(value?: string) {
  if (!value) return null

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  return Number.isNaN(date.getTime()) ? null : date
}

export default function SearchBar({ className, initialValues, onSearch }: SearchBarProps) {
  const router = useRouter()
  const [location, setLocation] = useState(initialValues?.location ?? '')
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: parseDate(initialValues?.checkIn),
    endDate: parseDate(initialValues?.checkOut),
  })

  const [adults, setAdults] = useState(initialValues?.guests ?? 1)
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
        'relative z-30 w-full bg-white rounded-3xl md:rounded-full border border-slate-200/90 shadow-xl shadow-slate-900/5 p-3 flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-0 transition-all focus-within:ring-2 focus-within:ring-[#FF5A1F]/30',
        className
      )}
      role="search"
    >
      {/* WHERE field */}
      <div
        className={cn(
          'flex-1 flex items-center gap-3 px-5 py-2.5 rounded-2xl md:rounded-l-full cursor-pointer hover:bg-slate-50/80 transition-colors group',
          activeField === 'location' && 'bg-slate-50'
        )}
        onClick={() => {
          setActiveField('location')
          document.getElementById('search-location')?.focus()
        }}
      >
        <div className="w-10 h-10 rounded-xl bg-[#FFF0EB] flex items-center justify-center text-[#FF5A1F] transition-colors shrink-0">
          <MapPin className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col text-left">
          <label
            htmlFor="search-location"
            className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5"
          >
            WHERE TO
          </label>
          <input
            id="search-location"
            type="text"
            placeholder="Search destination or city..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onFocus={() => setActiveField('location')}
            onBlur={() => setTimeout(() => setActiveField(null), 200)}
            className="w-full border-0 bg-transparent p-0 text-xs sm:text-sm font-semibold text-slate-900 placeholder-slate-400 focus:ring-0 focus:outline-none"
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
        className="gradient-bg text-white h-14 w-full md:w-14 rounded-2xl md:rounded-full flex items-center justify-center shadow-md shadow-[#FF5A1F]/25 hover:shadow-lg transition-all duration-300 transform active:scale-95 shrink-0 gap-2 md:gap-0 font-bold"
        aria-label="Search properties"
      >
        <Search className="w-5 h-5" />
        <span className="md:hidden">Find Stays</span>
      </button>
    </div>
  )
}
