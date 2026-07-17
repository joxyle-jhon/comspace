'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, X } from 'lucide-react'
import { propertiesApi } from '@/lib/services'
import { PropertyCard } from '@/components/properties/PropertyCard'
import { PropertyGridSkeleton } from '@/components/properties/PropertyCardSkeleton'
import { EmptyState, ErrorState } from '@/components/ui/EmptyState'
import { SearchBar } from '@/components/search/SearchBar'
import { FilterPanel } from '@/components/search/FilterPanel'
import type { PropertySearchParams } from '@/types'
import { cn } from '@/lib/utils'

const PROPERTY_TYPES = ['apartment', 'house', 'villa', 'cabin', 'studio', 'loft', 'condo'] as const

export function PropertiesPageClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [page, setPage] = useState(1)

  const params: PropertySearchParams = {
    location: searchParams.get('location') ?? undefined,
    check_in: searchParams.get('check_in') ?? undefined,
    check_out: searchParams.get('check_out') ?? undefined,
    guests: searchParams.get('guests') ? Number(searchParams.get('guests')) : undefined,
    type: searchParams.get('type') ?? undefined,
    min_price: searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined,
    max_price: searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined,
    instant_book: searchParams.get('instant_book') === 'true' ? true : undefined,
    sort: (searchParams.get('sort') as PropertySearchParams['sort']) ?? 'created_at',
    page,
    per_page: 12,
  }

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['properties', params],
    queryFn: () => propertiesApi.list(params),
    placeholderData: (prev) => prev,
  })

  const activeFilterCount = [
    params.type, params.min_price, params.max_price,
    params.instant_book, params.guests,
  ].filter(Boolean).length

  const setSort = useCallback(
    (sort: string) => {
      const sp = new URLSearchParams(searchParams.toString())
      sp.set('sort', sort)
      router.push(`/properties?${sp.toString()}`)
    },
    [searchParams, router]
  )

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Sticky search bar */}
      <div className="sticky top-16 z-30 bg-white border-b border-stone-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex gap-3 items-center">
            <div className="flex-1">
              <SearchBar compact />
            </div>
            <button
              id="filter-panel-toggle"
              onClick={() => setFiltersOpen((v) => !v)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all',
                filtersOpen || activeFilterCount > 0
                  ? 'bg-brand-500 text-white border-brand-500'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
              )}
              aria-expanded={filtersOpen}
              aria-controls="filter-panel"
            >
              <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 w-5 h-5 rounded-full bg-white text-brand-500 text-xs font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            id="filter-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden bg-white border-b border-stone-100"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <FilterPanel onClose={() => setFiltersOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Type filter chips */}
        <div className="flex gap-2 flex-wrap mb-6" role="group" aria-label="Filter by type">
          {PROPERTY_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => {
                const sp = new URLSearchParams(searchParams.toString())
                params.type === type ? sp.delete('type') : sp.set('type', type)
                router.push(`/properties?${sp.toString()}`)
              }}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium border transition-all capitalize',
                params.type === type
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
              )}
              aria-pressed={params.type === type}
            >
              {type}
            </button>
          ))}
          {params.type && (
            <button
              onClick={() => {
                const sp = new URLSearchParams(searchParams.toString())
                sp.delete('type')
                router.push(`/properties?${sp.toString()}`)
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm text-stone-500 hover:text-stone-700 border border-stone-200 hover:border-stone-400 transition-all"
              aria-label="Clear type filter"
            >
              <X className="w-3 h-3" aria-hidden="true" />
              Clear
            </button>
          )}
        </div>

        {/* Result count + sort */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-stone-600 text-sm">
            {isLoading ? (
              <span className="skeleton h-4 w-32 rounded inline-block" />
            ) : (
              <>
                <strong className="text-stone-900">{data?.meta.total ?? 0}</strong> properties found
              </>
            )}
          </p>
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-sm text-stone-500">Sort:</label>
            <select
              id="sort-select"
              value={params.sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-sm text-stone-700 bg-white border border-stone-200 rounded-lg px-3 py-1.5 outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <option value="created_at">Newest</option>
              <option value="price_per_night">Price: Low to High</option>
              <option value="average_rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <PropertyGridSkeleton count={12} />
        ) : isError ? (
          <ErrorState message="Failed to load properties. Please try again." />
        ) : data?.data.length === 0 ? (
          <EmptyState
            title="No properties found"
            description="Try adjusting your dates, location, or filters."
            action={{ label: 'Clear all filters', href: '/properties' }}
          />
        ) : (
          <motion.div
            layout
            className={cn(
              'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6',
              isFetching && 'opacity-70 transition-opacity'
            )}
          >
            {data?.data.map((property, i) => (
              <PropertyCard key={property.id} property={property} priority={i < 3} />
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {data && data.meta.last_page > 1 && (
          <div className="flex justify-center gap-2 mt-12" role="navigation" aria-label="Pagination">
            {Array.from({ length: data.meta.last_page }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                aria-label={`Page ${p}`}
                aria-current={p === page ? 'page' : undefined}
                className={cn(
                  'w-9 h-9 rounded-lg text-sm font-medium transition-all',
                  p === page
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-400'
                )}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
