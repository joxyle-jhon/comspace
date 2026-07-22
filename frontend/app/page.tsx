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

      {/* Hero Header Section */}
      <header className="relative pt-40 pb-28 bg-[#FDFBF9] overflow-hidden">
        {/* Soft Ambient Warm Lighting Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#FF5A1F]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[250px] bg-amber-400/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Curation Subtitle Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF0EB] border border-[#FF5A1F]/20 text-[#FF5A1F] text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Curated stays for remote focus & travel
          </span>

          {/* Editorial Title */}
          <h1 className="font-heading text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.08] mb-8 max-w-4xl mx-auto">
            Find your next stay to <br className="hidden sm:inline" />
            <span className="gradient-text">create, work, or unwind</span>.
          </h1>

          {/* Floating SearchBar Widget */}
          <div className="max-w-4xl mx-auto mt-8">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </header>

      {/* Stays Section */}
      <main className="py-20 bg-[#FDFBF9] relative z-[1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-[#FF5A1F] text-xs font-black uppercase tracking-wider mb-2">Explore Experiences</p>
              <h2 className="font-heading text-3xl font-black text-slate-900 tracking-tight">
                Top-rated spaces around the world
              </h2>
            </div>
            <Link
              href="/properties"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5A1F] hover:text-[#FF7A45] transition-colors"
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
                <div key={idx} className="bg-white rounded-3xl overflow-hidden border border-slate-200/60 p-4 space-y-4 animate-pulse">
                  <div className="aspect-[4/3] w-full bg-slate-200/80 rounded-2xl" />
                  <div className="h-4 bg-slate-200/80 rounded w-1/3" />
                  <div className="h-6 bg-slate-200/80 rounded w-3/4" />
                  <div className="h-4 bg-slate-200/80 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 max-w-md mx-auto">
              <p className="text-slate-600 font-bold mb-4">{error}</p>
              <button
                type="button"
                onClick={reloadProperties}
                className="px-6 py-2.5 gradient-bg text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all"
              >
                Try Again
              </button>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8 max-w-lg mx-auto">
              <p className="text-slate-800 font-bold text-lg mb-2">
                {activeCategory ? 'No stays found in this category' : 'No spaces found'}
              </p>
              <p className="text-slate-500 text-xs mb-6 leading-relaxed">
                {activeCategory
                  ? 'Try selecting a different stay category or clear filters to browse all spaces.'
                  : "We couldn't find any stays matching your filter parameters."}
              </p>
              <button
                type="button"
                onClick={() => {
                  if (activeCategory === null) reloadProperties()
                  else handleSelectCategory(null)
                }}
                className="px-6 py-3 gradient-bg text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md"
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

      <Footer />
    </>
  )
}
