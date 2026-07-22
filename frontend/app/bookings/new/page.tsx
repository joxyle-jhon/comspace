'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  Calendar,
  CreditCard,
  Lock,
  MapPin,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Users,
  Home,
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CheckoutStepper from '@/components/booking/CheckoutStepper'
import { propertiesApi, bookingsApi, type Property, type Booking } from '@/lib/services'
import { useAuthStore } from '@/store/useAuthStore'
import { formatCents } from '@/lib/utils'

interface PriceBreakdown {
  nights: number
  price_per_night: number
  subtotal: number
  cleaning_fee: number
  service_fee: number
  total_amount: number
}

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const propertyId = searchParams.get('property_id') || searchParams.get('property')
  const checkIn = searchParams.get('check_in') || ''
  const checkOut = searchParams.get('check_out') || ''
  const guestsParam = searchParams.get('guests') || '1'
  const guestCount = parseInt(guestsParam, 10) || 1

  const { user, token } = useAuthStore()

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [property, setProperty] = useState<Property | null>(null)
  const [breakdown, setBreakdown] = useState<PriceBreakdown | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Step 1 Form
  const [guestNote, setGuestNote] = useState('')
  const [agreedToRules, setAgreedToRules] = useState(true)

  // Step 2 Form (Mock Payment)
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExp, setCardExp] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Step 3 Result
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null)

  // Check auth
  useEffect(() => {
    const localToken = typeof window !== 'undefined' ? localStorage.getItem('comspace_token') : null
    if (!user && !token && !localToken) {
      const currentUrl = window.location.href
      router.push(`/auth/login?redirect=${encodeURIComponent(currentUrl)}`)
    }
  }, [user, token, router])

  // Parameter validation derived during render
  const paramError = !propertyId || !checkIn || !checkOut
    ? 'Missing stay parameters. Please select dates from a property listing.'
    : null

  // Fetch Property and Price Breakdown
  useEffect(() => {
    if (paramError || !propertyId) return

    let isCancelled = false

    Promise.all([
      propertiesApi.get(propertyId),
      propertiesApi.previewPrice(propertyId, { check_in: checkIn, check_out: checkOut }),
    ])
      .then(([propData, priceData]) => {
        if (!isCancelled) {
          setProperty(propData)
          setBreakdown(priceData)
          setError(null)
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setError('Could not fetch stay details or pricing breakdown.')
        }
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false)
      })

    return () => {
      isCancelled = true
    }
  }, [propertyId, checkIn, checkOut, paramError])

  const activeError = paramError || error

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreedToRules) {
      setError('You must agree to the house rules before continuing.')
      return
    }
    setError(null)
    setStep(2)
  }

  const handleCompleteBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cardNumber || !cardExp || !cardCvc || !cardName) {
      setError('Please fill in all payment card fields.')
      return
    }

    if (!propertyId) return

    setIsSubmitting(true)
    setError(null)

    try {
      const booking = await bookingsApi.create(propertyId, {
        check_in: checkIn,
        check_out: checkOut,
        guest_count: guestCount,
        guest_note: guestNote || undefined,
      })

      setCreatedBooking(booking)
      setStep(3)
    } catch (err) {
      const apiErr = err as { response?: { data?: { message?: string } } }
      setError(apiErr.response?.data?.message || 'Booking creation failed. The selected dates might conflict with an existing reservation.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 space-y-8 animate-pulse">
          <div className="h-10 bg-slate-200 rounded w-1/3 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 h-96 bg-slate-200 rounded-3xl" />
            <div className="h-80 bg-slate-200 rounded-3xl" />
          </div>
        </div>
      </div>
    )
  }

  if (activeError && !property && step !== 3) {
    return (
      <div className="min-h-[70vh] pt-32 pb-20 bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="font-heading text-xl font-bold text-slate-900 mb-2">Checkout Notice</h2>
          <p className="text-slate-500 text-sm mb-6">{activeError}</p>
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 px-6 py-3 gradient-bg text-white rounded-full font-bold text-xs uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Browse
          </Link>
        </div>
      </div>
    )
  }

  const coverImage =
    property?.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'

  return (
    <div className="min-h-screen pt-28 pb-24 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <CheckoutStepper currentStep={step} />

        {/* Global Error Banner */}
        {activeError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200 text-sm font-medium flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{activeError}</span>
          </div>
        )}

        {/* Step 1: Review Stay */}
        {step === 1 && property && (
          <form onSubmit={handleStep1Submit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <h2 className="font-heading font-black text-2xl text-slate-900">Your Stay Details</h2>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-brand-primary shrink-0" />
                    <div>
                      <span className="block text-[10px] font-bold uppercase text-slate-400">Check-in</span>
                      <span className="text-xs font-bold text-slate-900">{checkIn}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-brand-primary shrink-0" />
                    <div>
                      <span className="block text-[10px] font-bold uppercase text-slate-400">Check-out</span>
                      <span className="text-xs font-bold text-slate-900">{checkOut}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <Users className="w-5 h-5 text-brand-primary shrink-0" />
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-slate-400">Guests</span>
                    <span className="text-xs font-bold text-slate-900">
                      {guestCount} guest{guestCount > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message to Host */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
                <label htmlFor="guest-note-input" className="font-heading font-black text-lg text-slate-900 block">
                  Message for the Host (Optional)
                </label>
                <p className="text-xs text-slate-500">
                  Share the purpose of your trip or let your host know your arrival time.
                </p>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-slate-400 absolute top-3.5 left-3.5" />
                  <textarea
                    id="guest-note-input"
                    rows={3}
                    value={guestNote}
                    onChange={(e) => setGuestNote(e.target.value)}
                    placeholder="Hello! Excited to stay at your space..."
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* House Rules & Policies */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="font-heading font-black text-lg text-slate-900">Ground Rules</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  By staying here, you agree to treat the space with respect and follow house rules: keep noise down during quiet hours and leave key upon departure.
                </p>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToRules}
                    onChange={(e) => setAgreedToRules(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-primary focus:ring-brand-primary"
                  />
                  <span className="text-xs font-semibold text-slate-800">
                    I agree to the house rules and cancellation policy.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl gradient-bg text-white font-bold text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:opacity-95 transition-all"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6 sticky top-28">
                <div className="flex gap-4 items-center">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                    <Image src={coverImage} alt={property.title} fill className="object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary">
                      {property.type}
                    </span>
                    <h3 className="font-heading font-bold text-sm text-slate-900 line-clamp-2">{property.title}</h3>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {property.location?.city}, {property.location?.country}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-3 text-xs text-slate-600">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Price Details</h4>

                  {breakdown && (
                    <>
                      <div className="flex justify-between">
                        <span>
                          {formatCents(breakdown.price_per_night)} × {breakdown.nights} nights
                        </span>
                        <span className="font-semibold text-slate-800">{formatCents(breakdown.subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cleaning fee</span>
                        <span className="font-semibold text-slate-800">{formatCents(breakdown.cleaning_fee)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Service fee</span>
                        <span className="font-semibold text-slate-800">{formatCents(breakdown.service_fee)}</span>
                      </div>
                      <div className="border-t border-slate-100 pt-3 flex justify-between text-sm font-bold text-slate-900">
                        <span>Total</span>
                        <span className="text-brand-primary font-black text-base">
                          {formatCents(breakdown.total_amount)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Step 2: Payment Details */}
        {step === 2 && property && (
          <form onSubmit={handleCompleteBooking} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="font-heading font-black text-2xl text-slate-900">Payment Details</h2>
                    <p className="text-xs text-slate-500">Encrypted payment via 256-bit SSL connection</p>
                  </div>
                  <Lock className="w-5 h-5 text-emerald-600" />
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="card-name" className="block text-xs font-bold text-slate-700 mb-1">
                      Name on Card
                    </label>
                    <input
                      id="card-name"
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="card-number" className="block text-xs font-bold text-slate-700 mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-slate-400 absolute top-3.5 left-3.5" />
                      <input
                        id="card-number"
                        type="text"
                        required
                        placeholder="4242 •••• •••• 4242"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="card-exp" className="block text-xs font-bold text-slate-700 mb-1">
                        Expiration Date
                      </label>
                      <input
                        id="card-exp"
                        type="text"
                        required
                        placeholder="MM / YY"
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="card-cvc" className="block text-xs font-bold text-slate-700 mb-1">
                        CVC Code
                      </label>
                      <input
                        id="card-cvc"
                        type="text"
                        required
                        placeholder="123"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400 text-xs pt-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Your payment details are processed securely.</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-4 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-slate-100"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-4 px-6 rounded-2xl gradient-bg text-white font-bold text-sm uppercase tracking-wider shadow-lg hover:opacity-95 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing Payment...' : 'Complete Reservation & Pay'}
                </button>
              </div>
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4 sticky top-28">
                <h4 className="font-heading font-bold text-slate-900 text-base">Reservation Summary</h4>
                <div className="text-xs text-slate-600 space-y-2 border-b border-slate-100 pb-4">
                  <p className="font-bold text-slate-800">{property.title}</p>
                  <p>
                    {checkIn} to {checkOut} ({breakdown?.nights} nights)
                  </p>
                  <p>{guestCount} Guests</p>
                </div>

                {breakdown && (
                  <div className="flex justify-between items-center text-sm font-bold text-slate-900 pt-1">
                    <span>Total Charged</span>
                    <span className="text-brand-primary text-lg font-black">
                      {formatCents(breakdown.total_amount)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </form>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && createdBooking && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
                Booking Confirmed
              </span>
              <h1 className="font-heading font-black text-3xl text-slate-900">Pack your bags!</h1>
              <p className="text-slate-500 text-sm mt-1">Your reservation code is #{createdBooking.id}</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-left space-y-3 text-xs text-slate-700">
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="font-semibold text-slate-500">Property</span>
                <span className="font-bold text-slate-900">{property?.title || 'Stay'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="font-semibold text-slate-500">Check-in</span>
                <span className="font-bold text-slate-900">{createdBooking.check_in}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="font-semibold text-slate-500">Check-out</span>
                <span className="font-bold text-slate-900">{createdBooking.check_out}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Guests</span>
                <span className="font-bold text-slate-900">{createdBooking.guest_count} Guests</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/bookings"
                className="flex-1 py-3.5 px-6 rounded-2xl gradient-bg text-white font-bold text-xs uppercase tracking-wider shadow-md hover:opacity-95 transition-opacity"
              >
                View My Bookings
              </Link>
              <Link
                href="/"
                className="flex-1 py-3.5 px-6 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <Home className="w-4 h-4" />
                Return to Explore
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div className="min-h-screen pt-32 pb-20 bg-slate-50 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <CheckoutContent />
      </Suspense>
      <Footer />
    </>
  )
}
