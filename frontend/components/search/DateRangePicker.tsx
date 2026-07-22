'use client'

import { useState, useEffect, useRef } from 'react'
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DateRange {
  startDate: Date | null
  endDate: Date | null
}

interface DateRangePickerProps {
  value: DateRange
  onChange: (value: DateRange) => void
}

export default function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [hoverDate, setHoverDate] = useState<Date | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleDayClick = (date: Date) => {
    if (!value.startDate || (value.startDate && value.endDate)) {
      onChange({ startDate: date, endDate: null })
    } else {
      if (date < value.startDate) {
        onChange({ startDate: date, endDate: null })
      } else {
        onChange({ startDate: value.startDate, endDate: date })
        setIsOpen(false)
      }
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange({ startDate: null, endDate: null })
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayIndex = new Date(year, month, 1).getDay()
    
    const days = []
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    return days
  }

  const isSelected = (date: Date) => {
    if (!date) return false
    return (
      (value.startDate && isSameDay(date, value.startDate)) ||
      (value.endDate && isSameDay(date, value.endDate))
    )
  }

  const isInRange = (date: Date) => {
    if (!date || !value.startDate) return false
    if (value.endDate) {
      return date > value.startDate && date < value.endDate
    }
    if (hoverDate) {
      return date > value.startDate && date < hoverDate
    }
    return false
  }

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    )
  }

  const formatDateLabel = () => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }
    if (value.startDate && value.endDate) {
      return `${value.startDate.toLocaleDateString('en-US', options)} – ${value.endDate.toLocaleDateString('en-US', options)}`
    }
    if (value.startDate) {
      return `${value.startDate.toLocaleDateString('en-US', options)} – Select end date`
    }
    return 'Select dates'
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const prevMonth = () => {
    const today = new Date()
    if (
      currentMonth.getFullYear() > today.getFullYear() ||
      currentMonth.getMonth() > today.getMonth()
    ) {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
    }
  }

  const days = getDaysInMonth(currentMonth)
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const weekDays = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']

  return (
    <div className="relative flex-1" ref={containerRef}>
      {/* Trigger Input UI */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-2.5 rounded-2xl cursor-pointer hover:bg-slate-50/80 transition-colors group',
          isOpen && 'bg-slate-50'
        )}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FFF0EB] flex items-center justify-center text-[#FF5A1F] transition-colors shrink-0">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0 flex flex-col text-left">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">
              DATES
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-900 block truncate">
              {formatDateLabel()}
            </span>
          </div>
        </div>

        {/* Clear dates button */}
        {(value.startDate || value.endDate) && (
          <button
            onClick={handleClear}
            className="w-6 h-6 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 shrink-0"
            title="Clear dates"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute left-0 z-50 mt-3 w-80 animate-in rounded-3xl border border-slate-100 bg-white p-5 shadow-2xl fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-heading font-bold text-slate-800 text-sm">{monthName}</h4>
            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday labels */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {weekDays.map((d) => (
              <span key={d} className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, idx) => {
              if (!date) {
                return <div key={`empty-${idx}`} />
              }

              const isPast = date < new Date(new Date().setHours(0, 0, 0, 0))
              const selected = isSelected(date)
              const range = isInRange(date)

              return (
                <button
                  key={date.toISOString()}
                  disabled={isPast}
                  onClick={() => handleDayClick(date)}
                  onMouseEnter={() => !isPast && setHoverDate(date)}
                  onMouseLeave={() => setHoverDate(null)}
                  className={cn(
                    'h-9 w-9 rounded-xl flex items-center justify-center text-xs font-semibold transition-all relative',
                    isPast
                      ? 'text-slate-200 cursor-not-allowed'
                      : 'text-slate-700 hover:bg-brand-light hover:text-brand-primary',
                    selected && 'bg-brand-primary text-white hover:bg-brand-primary hover:text-white',
                    range && 'bg-brand-light/35 text-brand-primary rounded-none'
                  )}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
