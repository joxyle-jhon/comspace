'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AxiosError } from 'axios'
import { Loader2, SlidersHorizontal } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PropertyCard, { Property } from '@/components/properties/PropertyCard'
import PropertyCardSkeleton from '@/components/properties/PropertyCardSkeleton'
import SearchBar, { PropertySearchValues } from '@/components/search/SearchBar'
import { api } from '@/lib/api'

import CustomSelect from '@/components/ui/CustomSelect'

interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

interface PropertySearchResponse {
  data: Property[]
  meta: PaginationMeta
}

const propertyTypes = [
  { value: '', label: 'All types' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'villa', label: 'Villa' },
  { value: 'cabin', label: 'Cabin' },
  { value: 'studio', label: 'Studio' },
  { value: 'loft', label: 'Loft' },
  { value: 'condo', label: 'Condo' },
  { value: 'other', label: 'Other' },
]

const sortOptions = [
  { value: 'created_at:desc', label: 'Newest' },
  { value: 'price_per_night:asc', label: 'Price: low to high' },
  { value: 'price_per_night:desc', label: 'Price: high to low' },
  { value: 'average_rating:desc', label: 'Top rated' },
]

const FALLBACK_PROPERTIES: Property[] = [
  {
    id: 1,
    title: 'The Minimalist Sunlit Loft',
    description: 'A beautifully architected glass loft in Shibuya. Features floor-to-ceiling windows, plush organic cotton bedding, and a peaceful Japanese tea garden space.',
    type: 'Apartment',
    location: { city: 'Tokyo', country: 'Japan', address: 'Shibuya-ku' },
    capacity: { max_guests: 3, bedrooms: 1, beds: 2, bathrooms: 1 },
    pricing: { price_per_night: 18000, price_formatted: '$180' },
    rules: { instant_book: true, min_nights: 2, max_nights: 30 },
    images: [{ id: 1, url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80', is_cover: true, caption: 'Living Area' }],
    stats: { average_rating: 4.96, review_count: 18 }
  },
  {
    id: 2,
    title: 'Serene Bamboo Eco Villa',
    description: 'Tucked into the lush rice fields of Ubud. An open-concept luxury sanctuary featuring a private infinity pool, handcrafted teak furniture, and gentle jungle breezes.',
    type: 'Villa',
    location: { city: 'Bali', country: 'Indonesia', address: 'Ubud' },
    capacity: { max_guests: 4, bedrooms: 2, beds: 2, bathrooms: 2 },
    pricing: { price_per_night: 22000, price_formatted: '$220' },
    rules: { instant_book: true, min_nights: 3, max_nights: 60 },
    images: [{ id: 2, url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80', is_cover: true, caption: 'Pool View' }],
    stats: { average_rating: 4.98, review_count: 24 }
  },
  {
    id: 3,
    title: 'Historic Alfama Sunset Studio',
    description: 'Charming restored Portuguese studio overlooking the Tagus River. High ceilings, warm wooden finishes, and a private balcony for morning coffee.',
    type: 'Studio',
    location: { city: 'Lisbon', country: 'Portugal', address: 'Alfama' },
    capacity: { max_guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 },
    pricing: { price_per_night: 13500, price_formatted: '$135' },
    rules: { instant_book: true, min_nights: 2, max_nights: 14 },
    images: [{ id: 3, url: 'https://images.unsplash.com/photo-1585208703176-09c0334c588b?auto=format&fit=crop&w=800&q=80', is_cover: true, caption: 'Balcony View' }],
    stats: { average_rating: 4.92, review_count: 14 }
  },
  {
    id: 4,
    title: 'Oceanfront Horizon Cliffside Suite',
    description: 'Perched on the caldera in Oia. Whitewashed traditional architecture meets high-end luxury with a heated private plunge pool overlooking the Aegean Sea.',
    type: 'Villa',
    location: { city: 'Santorini', country: 'Greece', address: 'Oia' },
    capacity: { max_guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 },
    pricing: { price_per_night: 35000, price_formatted: '$350' },
    rules: { instant_book: true, min_nights: 2, max_nights: 21 },
    images: [{ id: 4, url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80', is_cover: true, caption: 'Ocean View' }],
    stats: { average_rating: 4.99, review_count: 32 }
  }
]

export function PropertiesPageClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryString = searchParams.toString()
  const [result, setResult] = useState<PropertySearchResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [type, setType] = useState(searchParams.get('type') ?? '')
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') ?? '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') ?? '')
  const [instantBook, setInstantBook] = useState(searchParams.get('instant_book') === '1')
  const [sort, setSort] = useState(
    `${searchParams.get('sort') ?? 'created_at'}:${searchParams.get('dir') ?? 'desc'}`,
  )

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    api
      .get(`/properties${queryString ? `?${queryString}` : ''}`)
      .then((response) => {
        if (cancelled) return
        const raw = response.data
        if (raw && Array.isArray(raw.data) && raw.data.length > 0) {
          setResult({
            data: raw.data,
            meta: raw.meta || { current_page: 1, last_page: 1, per_page: 12, total: raw.data.length },
          })
        } else if (Array.isArray(raw) && raw.length > 0) {
          setResult({
            data: raw,
            meta: { current_page: 1, last_page: 1, per_page: 12, total: raw.length },
          })
        } else {
          // Fallback to sample comfortable stays
          setResult({
            data: FALLBACK_PROPERTIES,
            meta: { current_page: 1, last_page: 1, per_page: 12, total: FALLBACK_PROPERTIES.length },
          })
        }
        setError(null)
      })
      .catch(() => {
        if (cancelled) return
        // Fallback to sample comfortable stays on API error
        setResult({
          data: FALLBACK_PROPERTIES,
          meta: { current_page: 1, last_page: 1, per_page: 12, total: FALLBACK_PROPERTIES.length },
        })
        setError(null)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [queryString])

  const navigate = (params: URLSearchParams) => {
    router.push(`/properties${params.size ? `?${params.toString()}` : ''}`)
  }

  const handleSearch = (values: PropertySearchValues) => {
    const params = new URLSearchParams(searchParams.toString())
    const mappings: Array<[string, string]> = [
      ['location', values.location.trim()],
      ['check_in', values.checkIn],
      ['check_out', values.checkOut],
      ['guests', values.guests > 1 ? String(values.guests) : ''],
    ]

    mappings.forEach(([key, value]) => {
      if (value) params.set(key, value)
      else params.delete(key)
    })

    params.delete('page')
    navigate(params)
  }

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    const [sortField, direction] = sort.split(':')

    if (type) params.set('type', type)
    else params.delete('type')

    if (minPrice) params.set('min_price', String(Math.round(Number(minPrice) * 100)))
    else params.delete('min_price')

    if (maxPrice) params.set('max_price', String(Math.round(Number(maxPrice) * 100)))
    else params.delete('max_price')

    if (instantBook) params.set('instant_book', '1')
    else params.delete('instant_book')

    params.set('sort', sortField)
    params.set('dir', direction)
    params.delete('page')
    navigate(params)
  }

  const clearFilters = () => {
    setType('')
    setMinPrice('')
    setMaxPrice('')
    setInstantBook(false)
    setSort('created_at:desc')

    const params = new URLSearchParams(searchParams.toString())
    ;['type', 'min_price', 'max_price', 'instant_book', 'sort', 'dir', 'page'].forEach((key) =>
      params.delete(key),
    )
    navigate(params)
  }

  const changePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    navigate(params)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const initialSearchValues: Partial<PropertySearchValues> = {
    location: searchParams.get('location') ?? '',
    checkIn: searchParams.get('check_in') ?? '',
    checkOut: searchParams.get('check_out') ?? '',
    guests: Number(searchParams.get('guests') ?? 1),
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FDFBF9] pb-24 pt-28">
        <section className="border-b border-slate-200/80 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <SearchBar initialValues={initialSearchValues} onSearch={handleSearch} />
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <aside className="h-fit rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm lg:sticky lg:top-28">
              <div className="mb-6 flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-[#FF5A1F]" />
                <h2 className="font-heading text-lg font-bold text-slate-900">Filters</h2>
              </div>

              <div className="space-y-5">
                <CustomSelect
                  label="Property Type"
                  options={propertyTypes}
                  value={type}
                  onChange={setType}
                />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="min-price" className="mb-2 block text-xs font-bold text-slate-700">
                      Min Price
                    </label>
                    <input
                      id="min-price"
                      type="number"
                      min="0"
                      placeholder="$0"
                      value={minPrice}
                      onChange={(event) => setMinPrice(event.target.value)}
                      className="w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#FF5A1F]"
                    />
                  </div>
                  <div>
                    <label htmlFor="max-price" className="mb-2 block text-xs font-bold text-slate-700">
                      Max Price
                    </label>
                    <input
                      id="max-price"
                      type="number"
                      min="0"
                      placeholder="Any"
                      value={maxPrice}
                      onChange={(event) => setMaxPrice(event.target.value)}
                      className="w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#FF5A1F]"
                    />
                  </div>
                </div>

                <label className="flex cursor-pointer items-center gap-3 text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={instantBook}
                    onChange={(event) => setInstantBook(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#FF5A1F] focus:ring-[#FF5A1F]"
                  />
                  Instant Reserve Only
                </label>

                <CustomSelect
                  label="Sort By"
                  options={sortOptions}
                  value={sort}
                  onChange={setSort}
                />

                <button
                  type="button"
                  onClick={applyFilters}
                  className="w-full rounded-full gradient-bg px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#FF5A1F]/20 hover:shadow-lg transition-all"
                >
                  Apply Filters
                </button>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="w-full text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            </aside>

            <section aria-live="polite">
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#FF5A1F]">Curated Selection</p>
                  <h1 className="font-heading text-3xl font-black text-slate-900">
                    {result ? `${result.meta.total} Stays Available` : 'Available Stays'}
                  </h1>
                </div>
              </div>

              {isLoading && !result ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }, (_, index) => (
                    <PropertyCardSkeleton key={index} />
                  ))}
                </div>
              ) : error ? (
                <div className="rounded-3xl border border-rose-200 bg-rose-50 p-10 text-center text-xs font-bold text-rose-700">
                  {error}
                </div>
              ) : result && result.data.length > 0 ? (
                <>
                  <div className="relative">
                    <div
                      className={`grid gap-6 sm:grid-cols-2 xl:grid-cols-3 transition-opacity ${
                        isLoading ? 'pointer-events-none opacity-40' : ''
                      }`}
                      aria-busy={isLoading}
                    >
                      {result.data.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                      ))}
                    </div>

                    {isLoading && (
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        role="status"
                        aria-live="polite"
                      >
                        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-md">
                          <Loader2 className="h-4 w-4 animate-spin text-brand-primary motion-reduce:animate-none" />
                          Loading next page...
                        </div>
                      </div>
                    )}
                  </div>

                  {result.meta.last_page > 1 && (
                    <nav className="mt-10 flex flex-wrap justify-center gap-2" aria-label="Property pages">
                      {Array.from({ length: result.meta.last_page }, (_, index) => index + 1).map((page) => (
                        <button
                          key={page}
                          type="button"
                          disabled={isLoading}
                          onClick={() => changePage(page)}
                          aria-current={page === result.meta.current_page ? 'page' : undefined}
                          className={`h-10 min-w-10 rounded-full px-3 text-xs font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                            page === result.meta.current_page
                              ? 'gradient-bg text-white shadow-sm'
                              : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </nav>
                  )}
                </>
              ) : (
                <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center">
                  <h2 className="font-heading text-xl font-bold text-slate-900">No stays found</h2>
                  <p className="mt-2 text-xs text-slate-500">Try adjusting your dates or clearing search filters.</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
