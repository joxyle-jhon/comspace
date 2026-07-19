'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MapPin, Users, Star } from 'lucide-react'
import { formatCents, pluralize } from '@/lib/utils'
import type { Property } from '@/types/property'
import PropertyDetailModal from './PropertyDetailModal'

export type { Property, PropertyImage } from '@/types/property'

interface PropertyCardProps {
  property: Property
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const coverImage = property.images?.find((img) => img.is_cover) || property.images?.[0]

  return (
    <>
      <button
        type="button"
        onClick={() => setIsDetailOpen(true)}
        className="group flex h-full w-full flex-col overflow-hidden rounded-3xl border border-slate-100/80 bg-white text-left shadow-sm card-hover hover:border-slate-200/50 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
        aria-label={`View details for ${property.title}`}
      >
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-slate-100">
          {coverImage ? (
            <Image
              src={coverImage.url}
              alt={coverImage.caption || property.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              priority={false}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-slate-400">
              <span className="text-sm font-semibold">No Image Available</span>
            </div>
          )}

          {property.rules.instant_book && (
            <span className="absolute top-4 left-4 rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md backdrop-blur-sm">
              Instant
            </span>
          )}

          {property.stats.review_count > 0 && (
            <span className="absolute top-4 right-4 flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-extrabold text-emerald-700 shadow-sm">
              <Star className="h-3.5 w-3.5 fill-emerald-600 text-emerald-600" />
              {property.stats.average_rating.toFixed(1)}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-between p-6">
          <div>
            <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span>
                {property.location.city}, {property.location.country}
              </span>
            </div>

            <h3 className="mb-2 font-heading text-base font-bold leading-snug text-slate-900 line-clamp-1">
              {property.title}
            </h3>

            <div className="mb-4 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Users className="h-3.5 w-3.5 text-slate-400" />
              <span>
                {pluralize(property.capacity.bedrooms, 'bedroom')} · {property.capacity.max_guests} guests
              </span>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-4">
            <p className="font-bold text-slate-900">
              <span className="text-lg font-black text-brand-primary">
                {formatCents(property.pricing.price_per_night)}
              </span>
              <span className="text-xs font-medium text-slate-400"> / night</span>
            </p>

            {property.stats.review_count > 0 && (
              <span className="text-xs font-semibold text-slate-400">
                {pluralize(property.stats.review_count, 'review')}
              </span>
            )}
          </div>
        </div>
      </button>

      {isDetailOpen && (
        <PropertyDetailModal
          propertyId={property.id}
          onClose={() => setIsDetailOpen(false)}
        />
      )}
    </>
  )
}
