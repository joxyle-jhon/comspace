'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Sparkles, ShieldCheck, Compass, Star, Zap } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { api } from '@/lib/api'
import Navbar from '@/components/layout/Navbar'
import SearchBar, { PropertySearchValues } from '@/components/search/SearchBar'
import CategoryStrip from '@/components/home/CategoryStrip'
import PropertyCard, { Property } from '@/components/properties/PropertyCard'
import Footer from '@/components/layout/Footer'

const FEATURED_DESTINATIONS = [
  { city: 'Tokyo', country: 'Japan', stays: '142 stays', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80', tag: 'City Escape' },
  { city: 'Bali', country: 'Indonesia', stays: '210 stays', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80', tag: 'Villa Haven' },
  { city: 'Lisbon', country: 'Portugal', stays: '98 stays', image: 'https://images.unsplash.com/photo-1585208703176-09c0334c588b?auto=format&fit=crop&w=800&q=80', tag: 'Coastal Charm' },
  { city: 'Medellín', country: 'Colombia', stays: '85 stays', image: 'https://images.unsplash.com/photo-1599423300746-b62507ac9741?auto=format&fit=crop&w=800&q=80', tag: 'Peaceful Retreat' },
]

const TESTIMONIALS = [
  {
    name: 'Elena Rostova',
    role: 'Travel Enthusiast',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    comment: 'Comspace made finding a peaceful villa in Bali completely effortless. The cozy atmosphere and plush amenities were simply outstanding.',
    rating: 5,
    location: 'Canggu Villa Stay',
  },
  {
    name: 'Marcus Vance',
    role: 'Frequent Traveler',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    comment: 'The instant booking guarantee saved my vacation to Tokyo. Beautifully styled interior, quiet neighborhood, and incredible host!',
    rating: 5,
    location: 'Shinjuku Loft Stay',
  },
  {
    name: 'Sophia Chen',
    role: 'Weekend Explorer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    comment: 'Every stay is pre-checked for comfort and cleanliness. I had the most restful week staying in a serene Lisbon apartment.',
    rating: 5,
    location: 'Alfama Studio Stay',
  },
]

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    const params = activeCategory ? { type: activeCategory } : {}

    api
      .get('/properties', { params })
      .then((response) => {
        if (cancelled) return
        setProperties(response.data.data || [])
        setError(null)
      })
      .catch(() => {
        if (!cancelled) setError('Could not load properties at this time.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [activeCategory, reloadKey])

  const handleSelectCategory = (category: string | null) => {
    setIsLoading(true)
    setError(null)
    setActiveCategory(category)
  }

  const reloadProperties = () => {
    setIsLoading(true)
    setError(null)
    setReloadKey((key) => key + 1)
  }

  const handleSearch = async (searchParams: PropertySearchValues) => {
    setIsLoading(true)
    setError(null)
    try {
      const params: Record<string, string | number> = {}
      if (searchParams.location) params.location = searchParams.location
      if (searchParams.checkIn) params.check_in = searchParams.checkIn
      if (searchParams.checkOut) params.check_out = searchParams.checkOut
      if (searchParams.guests) params.guests = searchParams.guests
      if (activeCategory) params.type = activeCategory

      const res = await api.get('/properties', { params })
      setProperties(res.data.data || [])
    } catch {
      setError('Search request failed.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDestinationClick = (city: string) => {
    handleSearch({
      location: city,
      checkIn: '',
      checkOut: '',
      guests: 1,
    })
  }

  return (
    <>
      <Navbar />

      {/* Hero Header Section */}
      <header className="relative pt-36 pb-24 bg-[#FAF8F5] overflow-hidden z-20">
        {/* Soft Ambient Warm Lighting Glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#FF5A1F]/10 rounded-full blur-[140px]" />
          <div className="absolute top-1/3 right-5 w-[450px] h-[300px] bg-amber-400/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-30">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF0EB] border border-[#FF5A1F]/20 text-[#FF5A1F] text-[10px] sm:text-xs font-black uppercase tracking-widest mb-6 shadow-sm">
            <Zap className="w-3.5 h-3.5 fill-[#FF5A1F]" />
            <span>HANDPICKED COMFORTABLE STAYS WORLDWIDE</span>
          </div>

          {/* Editorial Title */}
          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.05] mb-6 max-w-4xl mx-auto">
            Book your next <br />
            <span className="gradient-text">comfortable space</span>.
          </h1>

          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
            Discover handpicked apartments, peaceful villas, and cozy lofts designed for complete relaxation and effortless living worldwide.
          </p>

          {/* Floating SearchBar Widget */}
          <div className="max-w-4xl mx-auto relative z-40">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Quick Destination Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-slate-500">
            <span className="text-slate-400">Popular destinations:</span>
            {['Tokyo', 'Bali', 'Lisbon', 'Medellín', 'Paris'].map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => handleDestinationClick(city)}
                className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-[#FF5A1F] hover:text-[#FF5A1F] transition-all shadow-2xs"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Live Value Metrics Bar */}
      <section className="bg-slate-900 py-6 border-y border-slate-800 text-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-[#FF5A1F]">1,400+</p>
              <p className="text-xs font-medium text-slate-400">Curated Comfortable Stays</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-[#FF5A1F]">100%</p>
              <p className="text-xs font-medium text-slate-400">Verified Quality Guarantee</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-[#FF5A1F]">4.96 / 5</p>
              <p className="text-xs font-medium text-slate-400">Average Guest Rating</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-[#FF5A1F]">24 / 7</p>
              <p className="text-xs font-medium text-slate-400">Dedicated Guest Concierge</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Stays Section */}
      <main className="py-20 bg-[#FAF8F5] relative z-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-[#FF5A1F] text-xs font-black uppercase tracking-widest mb-2">Explore Destinations</p>
              <h2 className="font-heading text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Top-rated spaces around the world
              </h2>
            </div>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF5A1F] hover:text-[#E64A19] transition-colors"
            >
              View all 100+ stays
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Category Filter Strip */}
          <CategoryStrip activeCategory={activeCategory} onSelectCategory={handleSelectCategory} />

          {/* Stays Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="bg-white rounded-3xl overflow-hidden border border-slate-200/60 p-4 space-y-4 animate-pulse">
                  <div className="aspect-[4/3] w-full bg-slate-200/80 rounded-2xl" />
                  <div className="h-4 bg-slate-200/80 rounded w-1/3" />
                  <div className="h-6 bg-slate-200/80 rounded w-3/4" />
                  <div className="h-4 bg-slate-200/80 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 max-w-md mx-auto shadow-sm">
              <p className="text-slate-700 font-bold mb-4">{error}</p>
              <button
                type="button"
                onClick={reloadProperties}
                className="px-6 py-3 gradient-bg text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md"
              >
                Try Again
              </button>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8 max-w-lg mx-auto shadow-sm">
              <p className="text-slate-900 font-black text-xl mb-2">
                {activeCategory ? 'No spaces found in this category' : 'No spaces found'}
              </p>
              <p className="text-slate-500 text-xs mb-6 leading-relaxed">
                {activeCategory
                  ? 'Try selecting a different stay category or clear filters to browse all spaces.'
                  : "We couldn't find any stays matching your search query."}
              </p>
              <button
                type="button"
                onClick={() => {
                  if (activeCategory === null) reloadProperties()
                  else handleSelectCategory(null)
                }}
                className="px-6 py-3 gradient-bg text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Trending Destinations Section */}
      <section className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[#FF5A1F] text-xs font-black uppercase tracking-widest block mb-2">
              Featured Global Getaways
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
              Explore destinations built for cozy & relaxed living
            </h2>
            <p className="text-slate-500 text-sm">
              Curated cities with vibrant neighborhoods, serene natural surroundings, and comfortable accommodations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_DESTINATIONS.map((dest) => (
              <div
                key={dest.city}
                onClick={() => handleDestinationClick(dest.city)}
                className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer shadow-md card-hover"
              >
                <Image
                  src={dest.image}
                  alt={dest.city}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                <span className="absolute top-4 left-4 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-900">
                  {dest.tag}
                </span>

                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-xs font-semibold text-[#FF5A1F] uppercase tracking-wider mb-1">
                    {dest.stays}
                  </p>
                  <h3 className="font-heading text-2xl font-black">{dest.city}</h3>
                  <p className="text-xs font-medium text-slate-300">{dest.country}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* "Why Book With Comspace" Feature Grid */}
      <section className="py-24 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#FF5A1F] text-xs font-black uppercase tracking-widest block mb-2">
              The Comspace Difference
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
              Everything you need for an unforgettable stay
            </h2>
            <p className="text-slate-500 text-sm">
              We go beyond standard rental sites to ensure every property delivers premium comfort and peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 hover:border-[#FF5A1F]/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF0EB] text-[#FF5A1F] flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-slate-900">Vetted Premium Comfort</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Every space undergoes quality checks for high-end furnishings, plush linens, and pristine cleanliness.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 hover:border-[#FF5A1F]/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF0EB] text-[#FF5A1F] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-slate-900">Instant Booking Guarantee</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Reserve instantly with locked-in pricing and zero hidden host cancellation surprises. What you book is guaranteed.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 hover:border-[#FF5A1F]/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF0EB] text-[#FF5A1F] flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-slate-900">Flexible Long Stay Discounts</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Planning an extended vacation or seasonal stay? Enjoy up to 35% automated long-stay discounts at check-out.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Guest Reviews Showcase */}
      <section className="py-24 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
            <div>
              <span className="text-[#FF5A1F] text-xs font-black uppercase tracking-widest block mb-2">
                Trusted by 10,000+ Guests
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Loved by travelers worldwide
              </h2>
            </div>
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200/80 px-4 py-2 rounded-full">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs font-black text-amber-900">4.96/5 Guest Rating</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-[#FAF8F5] p-8 rounded-3xl border border-slate-200/60 space-y-4">
                <div className="flex text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-xs leading-relaxed font-medium italic">&ldquo;{t.comment}&rdquo;</p>
                <div className="pt-4 border-t border-slate-200/60 flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                    <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{t.name}</h4>
                    <p className="text-[10px] font-semibold text-slate-400">{t.role} · {t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

