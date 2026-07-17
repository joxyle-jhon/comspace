'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Star, MapPin, Users } from 'lucide-react'
import { cn, formatCents, pluralize } from '@/lib/utils'
import type { Property } from '@/types'

interface PropertyCardProps {
  property: Property
  className?: string
  priority?: boolean
}

export function PropertyCard({ property, className, priority = false }: PropertyCardProps) {
  const cover = property.images?.find((img) => img.is_cover) ?? property.images?.[0]
  const location = `${property.location.city}, ${property.location.country}`

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn('group', className)}
    >
      <Link
        href={`/properties/${property.id}`}
        aria-label={`View ${property.title} in ${location}`}
        className="block rounded-2xl overflow-hidden bg-white shadow-card card-hover focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
          {cover ? (
            <Image
              src={cover.url}
              alt={cover.caption ?? property.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority={priority}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-stone-200">
              <span className="text-stone-400 text-sm">No image</span>
            </div>
          )}

          {/* Instant book badge */}
          {property.rules.instant_book && (
            <span className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-teal-500 text-white text-xs font-semibold">
              Instant Book
            </span>
          )}

          {/* Rating badge */}
          {property.stats.review_count > 0 && (
            <span className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-stone-800 text-xs font-semibold shadow-sm">
              <Star className="w-3 h-3 fill-brand-500 text-brand-500" aria-hidden="true" />
              {property.stats.average_rating.toFixed(1)}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="p-4">
          {/* Location */}
          <div className="flex items-center gap-1 text-stone-500 text-xs mb-1">
            <MapPin className="w-3 h-3 shrink-0" aria-hidden="true" />
            <span>{location}</span>
          </div>

          {/* Title */}
          <h3 className="font-heading font-semibold text-stone-900 text-sm leading-snug line-clamp-2 mb-2">
            {property.title}
          </h3>

          {/* Capacity row */}
          <div className="flex items-center gap-1 text-stone-400 text-xs mb-3">
            <Users className="w-3 h-3" aria-hidden="true" />
            <span>
              {pluralize(property.capacity.bedrooms, 'bedroom')} ·{' '}
              {pluralize(property.capacity.bathrooms, 'bath')} ·{' '}
              Up to {property.capacity.max_guests} guests
            </span>
          </div>

          {/* Price */}
          <div className="flex items-end justify-between">
            <p className="text-stone-900 font-semibold">
              <span className="text-lg">{formatCents(property.pricing.price_per_night)}</span>
              <span className="text-stone-500 font-normal text-sm"> / night</span>
            </p>

            {property.stats.review_count > 0 && (
              <p className="text-stone-400 text-xs">
                {pluralize(property.stats.review_count, 'review')}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
