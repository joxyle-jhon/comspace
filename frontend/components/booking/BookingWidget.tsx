'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Minus, Plus, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { propertiesApi, type Property } from '@/lib/services'
import { formatCents } from '@/lib/utils'

interface BookingWidgetProps {
  property: Property
}

interface PriceBreakdown {
  nights: number
  price_per_night: number
  subtotal: number
  cleaning_fee: number
  service_fee: number
  total_amount: number
}

export default function BookingWidget({ property }: BookingWidgetProps) {
  const router = useRouter()
  const { user } = useAuthStore()

  // Default dates: check_in tomorrow, check_out 3 days later
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const defaultOut = new Date(tomorrow)
  defaultOut.setDate(defaultOut.getDate() + (property.rules?.min_nights || 2))

  const formatDateStr = (d: Date) => d.toISOString().split('T')[0]

  const [checkIn, setCheckIn] = useState(formatDateStr(tomorrow))
  const [checkOut, setCheckOut] = useState(formatDateStr(defaultOut))
  const [guests, setGuests] = useState(1)
  const [breakdown, setBreakdown] = useState<PriceBreakdown | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  const minCheckIn = formatDateStr(tomorrow)
  const maxGuests = property.capacity?.max_guests || 4

  // Calculate validation error during render
  const inDate = checkIn ? new Date(checkIn) : null
  const outDate = checkOut ? new Date(checkOut) : null

  let validationError: string | null = null
  if (inDate && outDate) {
    if (outDate <= inDate) {
      validationError = 'Check-out date must be after check-in date.'
    } else {
      const diffDays = Math.ceil((outDate.getTime() - inDate.getTime()) / (1000 * 3600 * 24))
      const minNights = property.rules?.min_nights || 1
      if (diffDays < minNights) {
        validationError = `Minimum stay is ${minNights} night${minNights > 1 ? 's' : ''}.`
      }
    }
  }

  // Fetch price breakdown whenever valid dates change
  useEffect(() => {
    if (!checkIn || !checkOut || validationError) return

    let isCancelled = false

    propertiesApi
      .previewPrice(property.id, { check_in: checkIn, check_out: checkOut })
      .then((data) => {
        if (!isCancelled) setBreakdown(data)
      })
      .catch(() => {
        if (isCancelled) return
        const startDate = new Date(checkIn)
        const endDate = new Date(checkOut)
        const diffDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))
        const priceCents = property.pricing?.price_per_night || 0
        const subtotal = priceCents * diffDays
        const cleaningFee = property.pricing?.cleaning_fee || 3500
        const serviceFee = Math.round(subtotal * 0.1)
        setBreakdown({
          nights: diffDays,
          price_per_night: priceCents,
          subtotal,
          cleaning_fee: cleaningFee,
          service_fee: serviceFee,
          total_amount: subtotal + cleaningFee + serviceFee,
        })
      })
      .finally(() => {
        if (!isCancelled) setIsCalculating(false)
      })

    return () => {
      isCancelled = true
    }
  }, [checkIn, checkOut, validationError, property.id, property.pricing, property.rules])

  const activeError = validationError

  const handleReserve = () => {
    if (activeError || !checkIn || !checkOut) return

    const checkoutUrl = `/bookings/new?property_id=${property.id}&check_in=${checkIn}&check_out=${checkOut}&guests=${guests}`

    if (!user) {
      router.push(`/auth/login?redirect=${encodeURIComponent(checkoutUrl)}`)
    } else {
      router.push(checkoutUrl)
    }
  }

  const widgetContent = (
    <div className="space-y-6">
      {/* Price Header */}
      <div className="flex items-baseline justify-between border-b border-slate-100 pb-5">
        <div>
          <span className="text-3xl font-black text-slate-900 tracking-tight">
            {property.pricing?.price_formatted || formatCents(property.pricing?.price_per_night || 0)}
          </span>
          <span className="text-slate-500 font-medium text-sm"> / night</span>
        </div>
        {property.stats?.average_rating > 0 && (
          <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{property.stats.average_rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Inputs Card */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-1.5 space-y-1">
        {/* Date Row */}
        <div className="grid grid-cols-2 gap-1">
          <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm focus-within:ring-2 focus-within:ring-brand-primary">
            <label htmlFor="widget-checkin" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Check-in
            </label>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-primary shrink-0" />
              <input
                id="widget-checkin"
                type="date"
                min={minCheckIn}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm focus-within:ring-2 focus-within:ring-brand-primary">
            <label htmlFor="widget-checkout" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Check-out
            </label>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-primary shrink-0" />
              <input
                id="widget-checkout"
                type="date"
                min={checkIn || minCheckIn}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Guests Row */}
        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <label htmlFor="widget-guests-count" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Guests
            </label>
            <span id="widget-guests-count" className="text-xs font-semibold text-slate-800">
              {guests} guest{guests > 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              disabled={guests <= 1}
              aria-label="Decrease guests count"
              className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-4 text-center text-xs font-bold text-slate-800">{guests}</span>
            <button
              type="button"
              onClick={() => setGuests((g) => Math.min(maxGuests, g + 1))}
              disabled={guests >= maxGuests}
              aria-label="Increase guests count"
              className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {activeError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium border border-rose-100">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{activeError}</span>
        </div>
      )}

      {/* Price Breakdown Line Items */}
      {breakdown && !activeError && (
        <div className="space-y-3 pt-2 text-xs text-slate-600">
          <div className="flex justify-between items-center">
            <span>
              {formatCents(breakdown.price_per_night)} × {breakdown.nights} night{breakdown.nights > 1 ? 's' : ''}
            </span>
            <span className="font-semibold text-slate-800">{formatCents(breakdown.subtotal)}</span>
          </div>

          {breakdown.cleaning_fee > 0 && (
            <div className="flex justify-between items-center">
              <span>Cleaning fee</span>
              <span className="font-semibold text-slate-800">{formatCents(breakdown.cleaning_fee)}</span>
            </div>
          )}

          {breakdown.service_fee > 0 && (
            <div className="flex justify-between items-center">
              <span>Comspace service fee</span>
              <span className="font-semibold text-slate-800">{formatCents(breakdown.service_fee)}</span>
            </div>
          )}

          <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-sm font-bold text-slate-900">
            <span>Total before taxes</span>
            <span className="text-base text-brand-primary font-black">
              {formatCents(breakdown.total_amount)}
            </span>
          </div>
        </div>
      )}

      {/* Reserve Action Button */}
      <button
        type="button"
        onClick={handleReserve}
        disabled={!!activeError || isCalculating}
        className="w-full py-4 px-6 rounded-2xl gradient-bg text-white font-bold text-sm tracking-wider uppercase shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isCalculating ? 'Calculating...' : property.rules?.instant_book ? 'Instant Reserve' : 'Request to Book'}
      </button>

      {/* Trust Notice */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>You won&apos;t be charged yet</span>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sticky Card */}
      <div className="hidden lg:block sticky top-28 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-md">
        {widgetContent}
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 shadow-2xl flex items-center justify-between">
        <div>
          <span className="text-lg font-black text-slate-900">
            {property.pricing?.price_formatted || formatCents(property.pricing?.price_per_night || 0)}
          </span>
          <span className="text-slate-500 text-xs font-medium"> / night</span>
          {breakdown && !error && (
            <p className="text-[11px] font-bold text-brand-primary">Total: {formatCents(breakdown.total_amount)}</p>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          className="px-6 py-3 rounded-full gradient-bg text-white font-bold text-xs uppercase tracking-wider shadow-md"
        >
          Check Availability
        </button>
      </div>

      {/* Mobile Drawer Modal */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end animate-in fade-in duration-200">
          <div className="w-full bg-white rounded-t-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-heading font-bold text-lg text-slate-900">Reserve Stay</h3>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>
            {widgetContent}
          </div>
        </div>
      )}
    </>
  )
}
