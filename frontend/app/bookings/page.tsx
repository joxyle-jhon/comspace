'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Calendar,
  MapPin,
  Users,
  Shield,
  Star,
  XCircle,
  Sparkles,
  AlertCircle,
  Building2,
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ReviewModal from '@/components/booking/ReviewModal'
import { bookingsApi, type Booking } from '@/lib/services'
import { useAuthStore } from '@/store/useAuthStore'
import { formatCents } from '@/lib/utils'

export default function BookingsListPage() {
  const router = useRouter()
  const { user, token } = useAuthStore()

  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all')

  // Review Modal State
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null)

  // Cancel Confirmation State
  const [cancellingBookingId, setCancellingBookingId] = useState<number | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)

  // Auth guard
  useEffect(() => {
    const localToken = typeof window !== 'undefined' ? localStorage.getItem('comspace_token') : null
    if (!user && !token && !localToken) {
      router.push('/auth/login?redirect=/bookings')
    }
  }, [user, token, router])

  const refetchBookings = () => {
    setIsLoading(true)
    setReloadKey((k) => k + 1)
  }

  useEffect(() => {
    let cancelled = false

    bookingsApi
      .list()
      .then((data) => {
        if (!cancelled) {
          setBookings(data || [])
          setError(null)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Could not load your reservations. Please try again.')
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [reloadKey])

  const handleCancelBooking = async (bookingId: number) => {
    setIsCancelling(true)
    try {
      await bookingsApi.cancel(bookingId)
      setCancellingBookingId(null)
      refetchBookings()
    } catch (err) {
      const apiErr = err as { response?: { data?: { message?: string } } }
      alert(apiErr.response?.data?.message || 'Failed to cancel reservation.')
    } finally {
      setIsCancelling(false)
    }
  }

  // Filter bookings based on activeTab
  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'upcoming') return b.status === 'pending' || b.status === 'confirmed'
    if (activeTab === 'completed') return b.status === 'completed'
    if (activeTab === 'cancelled') return b.status === 'cancelled'
    return true
  })

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Confirmed
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-extrabold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Pending Host Approval
          </span>
        )
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold uppercase tracking-wider">
            Completed Stay
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold uppercase tracking-wider">
            Cancelled
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
            {status}
          </span>
        )
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FDFBF9] pt-36 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header & Tabs */}
          <div className="mb-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF0EB] border border-[#FF5A1F]/20 text-[#FF5A1F] text-xs font-bold uppercase tracking-wider mb-3">
              <Shield className="w-3.5 h-3.5" />
              Guest Reservations
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-6">
              My Reservations
            </h1>

            {/* Navigation Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200/80">
              {[
                { id: 'all', label: 'All Stays', count: bookings.length },
                {
                  id: 'upcoming',
                  label: 'Upcoming',
                  count: bookings.filter((b) => b.status === 'pending' || b.status === 'confirmed').length,
                },
                {
                  id: 'completed',
                  label: 'Completed',
                  count: bookings.filter((b) => b.status === 'completed').length,
                },
                {
                  id: 'cancelled',
                  label: 'Cancelled',
                  count: bookings.filter((b) => b.status === 'cancelled').length,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                    activeTab === tab.id
                      ? 'gradient-bg text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          {/* Bookings List Content */}
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((idx) => (
                <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm animate-pulse flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-64 aspect-[4/3] bg-slate-200 rounded-2xl shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-1/4" />
                    <div className="h-6 bg-slate-200 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                    <div className="h-10 bg-slate-200 rounded-full w-1/3 mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 max-w-md mx-auto">
              <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
              <p className="text-slate-700 font-bold mb-4">{error}</p>
              <button
                type="button"
                onClick={refetchBookings}
                className="px-6 py-2.5 gradient-bg text-white rounded-full text-xs font-bold uppercase tracking-wider"
              >
                Try Again
              </button>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8 max-w-md mx-auto">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h2 className="font-heading font-black text-xl text-slate-900 mb-2">No reservations found</h2>
              <p className="text-slate-500 text-xs mb-6 leading-relaxed">
                {activeTab === 'all'
                  ? "You haven't reserved any stays yet. Explore our curated spaces around the world."
                  : `You don't have any ${activeTab} reservations at the moment.`}
              </p>
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 px-6 py-3 gradient-bg text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md shadow-[#FF5A1F]/20"
              >
                <Sparkles className="w-4 h-4" />
                Find Comfortable Spaces
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredBookings.map((booking) => {
                const coverImage =
                  booking.property?.images?.[0]?.url ||
                  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'

                const isUpcoming = booking.status === 'pending' || booking.status === 'confirmed'
                const isCompleted = booking.status === 'completed'

                return (
                  <div
                    key={booking.id}
                    className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col md:flex-row gap-6 hover:border-slate-300/80 transition-all duration-300"
                  >
                    {/* Thumbnail Image */}
                    <div className="relative w-full md:w-64 aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                      <Image
                        src={coverImage}
                        alt={booking.property?.title || 'Reserved property'}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Booking Information */}
                    <div className="flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                          {getStatusBadge(booking.status)}
                          <span className="text-xs font-bold text-slate-400">
                            Ref: #{booking.id}
                          </span>
                        </div>

                        <Link
                          href={booking.property?.id ? `/properties/${booking.property.id}` : '/properties'}
                          className="font-heading font-black text-xl text-slate-900 hover:text-[#FF5A1F] transition-colors line-clamp-1 block mb-2"
                        >
                          {booking.property?.title || 'Comfortable Stay'}
                        </Link>

                        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 mb-3">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#FF5A1F]" />
                            <span>
                              {booking.property?.location?.city || 'Location'}, {booking.property?.location?.country || 'Country'}
                            </span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            <span>{booking.guest_count} guest{booking.guest_count > 1 ? 's' : ''}</span>
                          </div>
                        </div>

                        {/* Dates Banner */}
                        <div className="bg-[#FDFBF9] border border-slate-200/60 p-3 rounded-2xl inline-flex items-center gap-3 text-xs font-semibold text-slate-800">
                          <Calendar className="w-4 h-4 text-[#FF5A1F] shrink-0" />
                          <span>
                            {new Date(booking.check_in).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}{' '}
                            –{' '}
                            {new Date(booking.check_out).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Footer Line: Total Amount & Actions */}
                      <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Total Paid
                          </span>
                          <span className="text-lg font-black text-[#FF5A1F]">
                            {booking.pricing?.total_formatted || formatCents(booking.pricing?.total_amount || 0)}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Cancel Action */}
                          {isUpcoming && (
                            <button
                              type="button"
                              onClick={() => setCancellingBookingId(booking.id)}
                              className="px-4 py-2 rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
                            >
                              Cancel Stay
                            </button>
                          )}

                          {/* Review Action */}
                          {isCompleted && (
                            <button
                              type="button"
                              onClick={() => setReviewBooking(booking)}
                              className="px-4 py-2 rounded-full border border-[#FF5A1F]/30 bg-[#FFF0EB] text-[#FF5A1F] hover:bg-[#FF5A1F] hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
                            >
                              <Star className="w-3.5 h-3.5 fill-[#FF5A1F] text-[#FF5A1F]" />
                              Leave Review
                            </button>
                          )}

                          <Link
                            href={booking.property?.id ? `/properties/${booking.property.id}` : '/properties'}
                            className="px-4 py-2 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors"
                          >
                            View Space
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {/* Review Modal */}
      {reviewBooking && (
        <ReviewModal
          booking={reviewBooking}
          onClose={() => setReviewBooking(null)}
          onSuccess={() => refetchBookings()}
        />
      )}

      {/* Cancel Confirmation Modal */}
      {cancellingBookingId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <XCircle className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="font-heading font-black text-xl text-slate-900">Cancel Reservation?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to cancel booking #{cancellingBookingId}? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancellingBookingId(null)}
                className="flex-1 py-2.5 rounded-full border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Keep Stay
              </button>
              <button
                type="button"
                onClick={() => handleCancelBooking(cancellingBookingId)}
                disabled={isCancelling}
                className="flex-1 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider"
              >
                {isCancelling ? 'Cancelling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
