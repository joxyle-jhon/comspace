'use client'

import { useEffect, useState } from 'react'
import { 
  DollarSign, 
  Calendar, 
  Building, 
  Star, 
  Check, 
  X, 
  ArrowRight,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'
import { hostApi, bookingsApi, HostStats, Booking } from '@/lib/services'

export default function HostDashboardPage() {
  const [stats, setStats] = useState<HostStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null)

  const fetchDashboardData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await hostApi.getStats()
      setStats(data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleConfirmBooking = async (id: number) => {
    setActionLoadingId(id)
    try {
      await bookingsApi.confirm(id)
      await fetchDashboardData()
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleCancelBooking = async (id: number) => {
    setActionLoadingId(id)
    try {
      await bookingsApi.cancel(id)
      await fetchDashboardData()
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoadingId(null)
    }
  }

  const getChartData = (bookings: Booking[]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const dataMap: Record<string, { name: string; revenue: number; bookings: number }> = {}

    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const mName = months[d.getMonth()]
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      dataMap[key] = { name: `${mName} ${d.getFullYear() % 100}`, revenue: 0, bookings: 0 }
    }

    bookings.forEach(b => {
      if (b.status === 'cancelled' || b.status === 'refunded') return
      const date = new Date(b.check_in)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      if (dataMap[key]) {
        dataMap[key].revenue += b.pricing.total_amount / 100
        dataMap[key].bookings += 1
      }
    })

    return Object.values(dataMap)
  }

  if (isLoading && !stats) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 bg-slate-200 rounded w-1/4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 h-96" />
          <div className="bg-white p-6 rounded-3xl border border-slate-100 h-96" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/50 p-8 max-w-md mx-auto mt-12">
        <p className="text-slate-500 font-semibold mb-4">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="px-6 py-2.5 bg-brand-primary hover:bg-brand-secondary text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  const chartData = stats ? getChartData(stats.recent_bookings) : []

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="font-heading text-3xl font-black text-slate-900 tracking-tight mb-2">Host Dashboard</h1>
        <p className="text-slate-500 text-sm">Welcome back! Manage your property performance, listings and reservation schedule.</p>
      </div>

      {stats && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/40 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Revenue</span>
                <h3 className="text-2xl font-black text-slate-900">${(stats.total_revenue / 100).toLocaleString()}</h3>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                  <TrendingUp className="w-3 h-3" />
                  All time earnings
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/40 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Active Listings</span>
                <h3 className="text-2xl font-black text-slate-900">{stats.total_properties}</h3>
                <Link href="/host/properties" className="text-[10px] font-bold text-brand-primary hover:underline">
                  Manage listings
                </Link>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-brand-light/30 flex items-center justify-center text-brand-primary">
                <Building className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/40 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Bookings</span>
                <h3 className="text-2xl font-black text-slate-900">{stats.total_bookings}</h3>
                <span className="text-[10px] font-medium text-slate-400">
                  {stats.pending_bookings} awaiting action
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Calendar className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/40 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Average Rating</span>
                <h3 className="text-2xl font-black text-slate-900">{stats.avg_rating}</h3>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.round(stats.avg_rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
                <Star className="w-6 h-6 fill-current" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/40 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg font-black text-slate-900">Revenue Performance</h3>
                  <p className="text-slate-400 text-xs">Estimated monthly earnings in USD</p>
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, 'Revenue']}
                      contentStyle={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    />
                    <Bar 
                      dataKey="revenue" 
                      fill="url(#colorRevenue)" 
                      radius={[6, 6, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ff6700" />
                        <stop offset="100%" stopColor="#ff9248" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/40 shadow-sm space-y-6 flex flex-col">
              <div>
                <h3 className="font-heading text-lg font-black text-slate-900">Upcoming Arrivals</h3>
                <p className="text-slate-400 text-xs">Reservations checking in next 7 days</p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {stats.upcoming_arrivals.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    <Calendar className="w-8 h-8 text-slate-300 mb-2" />
                    <p className="text-xs text-slate-400 font-semibold">No upcoming arrivals</p>
                  </div>
                ) : (
                  stats.upcoming_arrivals.map((booking) => (
                    <div key={booking.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start justify-between">
                      <div className="space-y-1 min-w-0">
                        <p className="font-bold text-slate-800 text-sm truncate">{booking.property?.title}</p>
                        <p className="text-xs text-slate-500 font-medium">Guest: {booking.guest?.name}</p>
                        <div className="text-[10px] font-bold text-brand-primary">
                          {new Date(booking.check_in).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(booking.check_out).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      <span className="text-xs font-black text-slate-800 shrink-0">
                        {booking.pricing.total_formatted}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/40 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-heading text-lg font-black text-slate-900">Recent Booking Requests</h3>
              <p className="text-slate-400 text-xs">Review guest reservation requests and booking status</p>
            </div>

            {stats.recent_bookings.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="font-semibold text-sm">No reservations found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Property</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Guest</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Dates</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Amount</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {stats.recent_bookings.map((booking) => {
                      const isPending = booking.status === 'pending'
                      const isConfirmed = booking.status === 'confirmed'
                      return (
                        <tr key={booking.id} className="hover:bg-slate-50/40 transition-colors">
                          <td className="px-6 py-4">
                            <span className="font-bold text-slate-800 text-sm truncate max-w-[200px] block">
                              {booking.property?.title}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {booking.guest?.name}
                          </td>
                          <td className="px-6 py-4 text-xs font-medium text-slate-500">
                            <div className="font-semibold text-slate-700">
                              {new Date(booking.check_in).toLocaleDateString()} - {new Date(booking.check_out).toLocaleDateString()}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{booking.pricing.nights} nights</div>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-slate-800">
                            {booking.pricing.total_formatted}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                isPending
                                  ? 'bg-amber-50 text-amber-600 border border-amber-200/50'
                                  : isConfirmed
                                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/50'
                                  : booking.status === 'cancelled' || booking.status === 'refunded'
                                  ? 'bg-red-50 text-red-600 border border-red-200/50'
                                  : 'bg-slate-50 text-slate-600 border border-slate-200/50'
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {actionLoadingId === booking.id ? (
                              <div className="w-5 h-5 border-2 border-brand-primary border-t-transparent rounded-full animate-spin ml-auto" />
                            ) : (
                              <div className="flex items-center justify-end gap-2">
                                {isPending && (
                                  <>
                                    <button
                                      onClick={() => handleConfirmBooking(booking.id)}
                                      className="p-1.5 rounded-lg border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-colors shadow-sm bg-white"
                                      aria-label="Confirm booking"
                                      title="Confirm Booking"
                                    >
                                      <Check className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleCancelBooking(booking.id)}
                                      className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors shadow-sm bg-white"
                                      aria-label="Decline booking"
                                      title="Decline Booking"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                                {isConfirmed && (
                                  <button
                                    onClick={() => handleCancelBooking(booking.id)}
                                    className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs font-semibold shadow-sm bg-white transition-colors"
                                    title="Cancel Booking"
                                  >
                                    Cancel
                                  </button>
                                )}
                                {!isPending && !isConfirmed && (
                                  <span className="text-xs text-slate-300 font-medium">None</span>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
