'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MapPin, Users, Star, Heart, Wifi, Sparkles } from 'lucide-react'
import { formatCents, pluralize, resolveMediaUrl } from '@/lib/utils'
import type { Property } from '@/types/property'
import PropertyDetailModal from './PropertyDetailModal'

export type { Property, PropertyImage } from '@/types/property'

interface PropertyCardProps {
  property: Property
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const coverImage = property.images?.find((img) => img.is_cover) || property.images?.[0]

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsSaved(!isSaved)
  }

  return (
    <>
      <div
        onClick={() => setIsDetailOpen(true)}
        className="group cursor-pointer p-2 rounded-[2rem] bg-slate-900/5 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-500 text-left"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIsDetailOpen(true)
          }
        }}
        aria-label={`View details for ${property.title}`}
      >
        <div className="flex h-full w-full flex-col overflow-hidden rounded-[calc(2rem-0.5rem)] bg-white border border-slate-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]">
          {/* Cover Image Container */}
          <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-slate-100">
            {coverImage ? (
              <Image
                src={resolveMediaUrl(coverImage.url)}
                alt={coverImage.caption || property.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                priority={false}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400 bg-slate-100">
                <span className="text-xs font-bold">No Image Available</span>
              </div>
            )}

            {/* Instant Reserve Tag */}
            {property.rules?.instant_book && (
              <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-slate-900/85 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
                <Sparkles className="w-3 h-3 text-[#FF5A1F]" />
                Instant Reserve
              </span>
            )}

            {/* Heart Wishlist Button */}
            <button
              type="button"
              onClick={toggleWishlist}
              aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-white/40 flex items-center justify-center text-slate-700 hover:scale-110 active:scale-95 transition-all shadow-md"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isSaved ? 'fill-rose-500 text-rose-500' : 'text-slate-600 hover:text-rose-500'
                }`}
              />
            </button>

            {/* Rating Badge Overlay */}
            {property.stats?.average_rating > 0 && (
              <div className="absolute bottom-3 left-4 flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-md px-2.5 py-1 text-xs font-black text-slate-900 shadow-md">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{property.stats.average_rating.toFixed(1)}</span>
                {property.stats.review_count > 0 && (
                  <span className="text-slate-400 font-medium">({property.stats.review_count})</span>
                )}
              </div>
            )}

            {/* Comfort Quality Indicator */}
            <div className="absolute bottom-3 right-4 flex items-center gap-1 rounded-full bg-slate-900/75 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white shadow-md">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Curated Comfort</span>
            </div>
          </div>

          {/* Property Content */}
          <div className="flex flex-1 flex-col justify-between p-6">
            <div>
              <div className="mb-2 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#FF5A1F]">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span>
                  {property.location?.city || 'Location'}, {property.location?.country || 'Country'}
                </span>
              </div>

              <h3 className="mb-2 font-heading text-lg font-black leading-snug text-slate-900 group-hover:text-[#FF5A1F] transition-colors line-clamp-1">
                {property.title}
              </h3>

              <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  {property.capacity?.max_guests || 2} guests
                </span>
                <span>•</span>
                <span>{pluralize(property.capacity?.bedrooms || 1, 'bedroom')}</span>
                <span>•</span>
                <span>{pluralize(property.capacity?.bathrooms || 1, 'bath')}</span>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-4">
              <div>
                <span className="text-xl font-black text-slate-900 tracking-tight">
                  {formatCents(property.pricing?.price_per_night || 0)}
                </span>
                <span className="text-xs font-medium text-slate-500"> / night</span>
              </div>

              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF5A1F] group-hover:translate-x-1 transition-transform">
                <span>Book Stay</span>
                <span className="w-6 h-6 rounded-full bg-[#FFF0EB] flex items-center justify-center text-[#FF5A1F] text-xs">
                  &rarr;
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {isDetailOpen && (
        <PropertyDetailModal
          propertyId={property.id}
          onClose={() => setIsDetailOpen(false)}
        />
      )}
    </>
  )
}

