'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { X } from 'lucide-react'

interface FilterPanelProps {
  onClose: () => void
}

export function FilterPanel({ onClose }: FilterPanelProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') ?? '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') ?? '')
  const [instantBook, setInstantBook] = useState(searchParams.get('instant_book') === 'true')
  const [guests, setGuests] = useState(searchParams.get('guests') ?? '')

  const applyFilters = () => {
    const sp = new URLSearchParams(searchParams.toString())
    if (minPrice) sp.set('min_price', minPrice)
    else sp.delete('min_price')
    if (maxPrice) sp.set('max_price', maxPrice)
    else sp.delete('max_price')
    if (instantBook) sp.set('instant_book', 'true')
    else sp.delete('instant_book')
    if (guests) sp.set('guests', guests)
    else sp.delete('guests')
    router.push(`/properties?${sp.toString()}`)
    onClose()
  }

  const clearFilters = () => {
    setMinPrice('')
    setMaxPrice('')
    setInstantBook(false)
    setGuests('')
    const sp = new URLSearchParams(searchParams.toString())
    ;['min_price', 'max_price', 'instant_book', 'guests'].forEach((k) => sp.delete(k))
    router.push(`/properties?${sp.toString()}`)
    onClose()
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Price range */}
      <fieldset>
        <legend className="text-sm font-semibold text-stone-800 mb-3">Price per night ($)</legend>
        <div className="flex gap-2">
          <div className="flex-1">
            <label htmlFor="filter-min-price" className="text-xs text-stone-500 mb-1 block">Min</label>
            <input
              id="filter-min-price"
              type="number"
              min={0}
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="filter-max-price" className="text-xs text-stone-500 mb-1 block">Max</label>
            <input
              id="filter-max-price"
              type="number"
              min={0}
              placeholder="Any"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            />
          </div>
        </div>
      </fieldset>

      {/* Guests */}
      <div>
        <label htmlFor="filter-guests" className="text-sm font-semibold text-stone-800 mb-3 block">
          Minimum guests
        </label>
        <input
          id="filter-guests"
          type="number"
          min={1}
          max={20}
          placeholder="Any"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        />
      </div>

      {/* Instant book */}
      <div>
        <p className="text-sm font-semibold text-stone-800 mb-3">Booking type</p>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            id="filter-instant-book"
            type="checkbox"
            checked={instantBook}
            onChange={(e) => setInstantBook(e.target.checked)}
            className="w-4 h-4 rounded border-stone-300 accent-brand-500"
          />
          <span className="text-sm text-stone-700">Instant book only</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex flex-col justify-end gap-2">
        <button
          id="filter-apply"
          onClick={applyFilters}
          className="px-5 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 transition-colors"
        >
          Apply filters
        </button>
        <button
          id="filter-clear"
          onClick={clearFilters}
          className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-sm hover:bg-stone-50 transition-colors"
        >
          <X className="w-3.5 h-3.5" aria-hidden="true" />
          Clear all
        </button>
      </div>
    </div>
  )
}
