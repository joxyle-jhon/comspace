'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Users, Star } from 'lucide-react'
import { formatCents, pluralize } from '@/lib/utils'

export interface PropertyImage {
  id: number
  url: string
  caption: string | null
  is_cover: boolean
}

export interface Property {
  id: number
  title: string
  description: string
  type: string
  location: {
    city: string
    country: string
  }
  capacity: {
    max_guests: number
    bedrooms: number
    beds: number
    bathrooms: number
  }
  pricing: {
    price_per_night: number
    price_formatted: string
  }
  rules: {
    instant_book: boolean
  }
  stats: {
    average_rating: number
    review_count: number
  }
  images?: PropertyImage[]
}

interface PropertyCardProps {
  property: Property
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const coverImage = property.images?.find((img) => img.is_cover) || property.images?.[0]

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group bg-white rounded-3xl overflow-hidden border border-slate-100/80 shadow-sm card-hover hover:border-slate-200/50 flex flex-col h-full focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 shrink-0">
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

        {/* Instant book badge */}
        {property.rules.instant_book && (
          <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-md">
            Instant
          </span>
        )}

        {/* Rating badge */}
        {property.stats.review_count > 0 && (
          <span className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold shadow-sm border border-emerald-100">
            <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
            {property.stats.average_rating.toFixed(1)}
          </span>
        )}
      </div>

      {/* Body content */}
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div>
          {/* Location */}
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span>{property.location.city}, {property.location.country}</span>
          </div>

          {/* Title */}
          <h3 className="font-heading font-bold text-slate-900 text-base leading-snug line-clamp-1 mb-2">
            {property.title}
          </h3>

          {/* Capacity */}
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mb-4">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {pluralize(property.capacity.bedrooms, 'bedroom')} · {property.capacity.max_guests} guests
            </span>
          </div>
        </div>

        {/* Price & reviews */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
          <p className="text-slate-900 font-bold">
            <span className="text-lg font-black text-brand-primary">
              {formatCents(property.pricing.price_per_night)}
            </span>
            <span className="text-slate-400 font-medium text-xs"> / night</span>
          </p>

          {property.stats.review_count > 0 && (
            <span className="text-slate-400 text-xs font-semibold">
              {pluralize(property.stats.review_count, 'review')}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
