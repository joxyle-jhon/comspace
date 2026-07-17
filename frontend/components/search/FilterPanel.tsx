'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useId, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

interface FilterPanelProps {
  onClose: () => void
}

export function FilterPanel({ onClose }: FilterPanelProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const instantBookId = useId()

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
      <fieldset>
        <legend className="text-sm font-semibold text-stone-800 mb-3">Price per night ($)</legend>
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="filter-min-price" className="text-xs text-muted-foreground mb-1">
              Min
            </Label>
            <Input
              id="filter-min-price"
              type="number"
              min={0}
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="filter-max-price" className="text-xs text-muted-foreground mb-1">
              Max
            </Label>
            <Input
              id="filter-max-price"
              type="number"
              min={0}
              placeholder="Any"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>
      </fieldset>

      <div>
        <Label htmlFor="filter-guests" className="text-sm font-semibold text-stone-800 mb-3 block">
          Minimum guests
        </Label>
        <Input
          id="filter-guests"
          type="number"
          min={1}
          max={20}
          placeholder="Any"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
        />
      </div>

      <div>
        <p className="text-sm font-semibold text-stone-800 mb-3">Booking type</p>
        <div className="flex items-center gap-3">
          <Checkbox
            id={instantBookId}
            checked={instantBook}
            onCheckedChange={(checked) => setInstantBook(checked === true)}
          />
          <Label htmlFor={instantBookId} className="text-sm font-normal text-stone-700 cursor-pointer">
            Instant book only
          </Label>
        </div>
      </div>

      <div className="flex flex-col justify-end gap-2">
        <Button type="button" id="filter-apply" size="xl" onClick={applyFilters}>
          Apply filters
        </Button>
        <Button type="button" id="filter-clear" variant="outline" size="xl" onClick={clearFilters}>
          <X className="w-3.5 h-3.5" aria-hidden="true" />
          Clear all
        </Button>
      </div>
    </div>
  )
}
