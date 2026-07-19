'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { api } from '@/lib/api'
import Navbar from '@/components/layout/Navbar'
import SearchBar, { PropertySearchValues } from '@/components/search/SearchBar'
import CategoryStrip from '@/components/home/CategoryStrip'
import PropertyCard, { Property } from '@/components/properties/PropertyCard'
import StatsSection from '@/components/home/StatsSection'
import WhyComspace from '@/components/home/WhyComspace'
import HostCTA from '@/components/home/HostCTA'
import Footer from '@/components/layout/Footer'

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

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <header 
        className="relative pt-36 pb-28 bg-cover bg-center z-[10]"
        style={{ backgroundImage: "url('/hero-bg.png')" }}
      >
        {/* Semi-transparent light orange overlay */}
        <div className="absolute inset-0 bg-[#ffd7b5]/65 backdrop-blur-[2px] z-0" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Subtitle Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-light/45 border border-brand-light/75 text-brand-primary text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            10,000+ unique spaces worldwide
          </span>

          {/* Main Title */}
          <h1 className="font-heading text-5xl sm:text-6xl font-black text-slate-900 tracking-tight leading-none mb-8 max-w-4xl mx-auto">
            Discover your <br className="hidden sm:inline" />
            <span className="gradient-text">comfortable space</span>.
          </h1>

          {/* SearchBar Widget */}
          <div className="max-w-4xl mx-auto mt-10">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </header>

      {/* Properties Display */}
      <main className="py-20 bg-slate-50 relative z-[1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-brand-primary text-xs font-bold uppercase tracking-wider mb-2">Featured Stays</p>
              <h2 className="font-heading text-3xl font-black text-slate-900 tracking-tight">
                Top-rated experiences
              </h2>
            </div>
            <Link
              href="/properties"
              className="hidden md:flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-primary hover:text-brand-secondary transition-colors"
            >
              View all stays
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Category Filter Strip */}
          <CategoryStrip activeCategory={activeCategory} onSelectCategory={handleSelectCategory} />

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="bg-white rounded-3xl overflow-hidden border border-slate-100 p-4 space-y-4 animate-pulse">
                  <div className="aspect-[4/3] w-full bg-slate-200 rounded-2xl" />
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-6 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-slate-500 font-semibold">{error}</p>
              <button
                onClick={reloadProperties}
                className="mt-4 px-6 py-2.5 bg-brand-primary hover:bg-brand-secondary text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/50 p-8">
              <p className="text-slate-500 font-semibold text-lg mb-2">
                {activeCategory ? 'No stays found in this category' : 'No spaces found'}
              </p>
              <p className="text-slate-400 text-sm mb-6">
                {activeCategory
                  ? 'Try selecting a different space type or clear filters to view all stays.'
                  : "We couldn't find any properties matching your current filter criteria."}
              </p>
              <button
                onClick={() => {
                  if (activeCategory === null) reloadProperties()
                  else handleSelectCategory(null)
                }}
                className="px-6 py-3 gradient-bg text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Trust Metrics Section */}
      <StatsSection />

      {/* Confidence/Features Section */}
      <WhyComspace />

      {/* Host CTA Banner */}
      <HostCTA />

      <Footer />
    </>
  )
}
