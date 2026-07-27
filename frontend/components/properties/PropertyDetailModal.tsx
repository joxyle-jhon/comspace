'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import {
  Bath,
  BedDouble,
  MapPin,
  Star,
  Users,
  X,
  Home,
  ShieldCheck,
} from 'lucide-react'
import { AxiosError } from 'axios'
import { api } from '@/lib/api'
import { formatCents, pluralize, resolveMediaUrl } from '@/lib/utils'
import type { Property, PropertyAmenity, PropertyReview } from '@/types/property'

interface PropertyDetailModalProps {
  propertyId: number
  onClose: () => void
}

function groupAmenities(amenities: PropertyAmenity[]) {
  return amenities.reduce<Record<string, PropertyAmenity[]>>((groups, amenity) => {
    const category = amenity.category || 'general'
    if (!groups[category]) groups[category] = []
    groups[category].push(amenity)
    return groups
  }, {})
}

function formatHostSince(value?: string | null) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function ReviewItem({ review }: { review: PropertyReview }) {
  return (
    <article className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-900">{review.guest?.name ?? 'Guest'}</p>
          <p className="text-xs text-slate-400">
            {new Date(review.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
          <Star className="h-3.5 w-3.5 fill-emerald-600 text-emerald-600" />
          {review.rating.toFixed(1)}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-slate-600">{review.comment}</p>
      {review.host_reply && (
        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">Host reply</p>
          <p className="text-sm text-slate-600">{review.host_reply}</p>
        </div>
      )}
    </article>
  )
}

export default function PropertyDetailModal({ propertyId, onClose }: PropertyDetailModalProps) {
  const titleId = useId()
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  useEffect(() => {
    let cancelled = false

    api
      .get<{ data: Property }>(`/properties/${propertyId}`)
      .then((response) => {
        if (cancelled) return
        setProperty(response.data.data)
        setError(null)
        setActiveImageIndex(0)
      })
      .catch((requestError: unknown) => {
        if (cancelled) return
        const message =
          requestError instanceof AxiosError
            ? requestError.response?.data?.error?.message
            : null
        setError(message ?? 'Could not load property details.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [propertyId])

  const images = property?.images ?? []
  const activeImage = images[activeImageIndex] ?? images[0]
  const amenityGroups = groupAmenities(property?.amenities ?? [])
  const hostSince = formatHostSince(property?.host?.host_since)

  if (typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close property details"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl border border-slate-200 bg-white shadow-2xl sm:rounded-3xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-primary">Property details</p>
            <h2 id={titleId} className="font-heading text-lg font-bold text-slate-900 sm:text-xl">
              {property?.title ?? 'Loading space'}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="aspect-[16/9] rounded-3xl bg-slate-200" />
              <div className="h-6 w-2/3 rounded bg-slate-200" />
              <div className="h-4 w-full rounded bg-slate-200" />
              <div className="h-4 w-5/6 rounded bg-slate-200" />
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="h-24 rounded-2xl bg-slate-200" />
                <div className="h-24 rounded-2xl bg-slate-200" />
              </div>
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center text-red-700">
              {error}
            </div>
          ) : property ? (
            <div className="space-y-8">
              <section>
                <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-slate-100">
                  {activeImage ? (
                    <Image
                      src={activeImage.url}
                      alt={activeImage.caption || property.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 896px"
                      priority
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-400">
                      No Image Available
                    </div>
                  )}
                </div>

                {images.length > 1 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {images.map((image, index) => (
                      <button
                        key={image.id}
                        type="button"
                        onClick={() => setActiveImageIndex(index)}
                        aria-label={`Show photo ${index + 1}`}
                        aria-pressed={index === activeImageIndex}
                        className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 ${
                          index === activeImageIndex
                            ? 'border-brand-primary'
                            : 'border-transparent'
                        }`}
                      >
                        <Image
                          src={resolveMediaUrl(image.url)}
                          alt={image.caption || `Photo ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </section>

              <section className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {property.location.city}, {property.location.country}
                  </span>
                  <span>·</span>
                  <span className="capitalize">{property.type}</span>
                  {property.rules.instant_book && (
                    <>
                      <span>·</span>
                      <span className="text-emerald-600">Instant book</span>
                    </>
                  )}
                </div>

                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-3xl font-black text-brand-primary">
                      {formatCents(property.pricing.price_per_night)}
                      <span className="ml-1 text-sm font-medium text-slate-400">/ night</span>
                    </p>
                    {property.stats.review_count > 0 && (
                      <p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-slate-600">
                        <Star className="h-4 w-4 fill-emerald-600 text-emerald-600" />
                        {property.stats.average_rating.toFixed(1)}
                        <span className="font-medium text-slate-400">
                          · {pluralize(property.stats.review_count, 'review')}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 text-sm font-semibold text-slate-600">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5">
                    <Users className="h-4 w-4 text-slate-400" />
                    {pluralize(property.capacity.max_guests, 'guest')}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5">
                    <Home className="h-4 w-4 text-slate-400" />
                    {pluralize(property.capacity.bedrooms, 'bedroom')}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5">
                    <BedDouble className="h-4 w-4 text-slate-400" />
                    {pluralize(property.capacity.beds, 'bed')}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5">
                    <Bath className="h-4 w-4 text-slate-400" />
                    {pluralize(property.capacity.bathrooms, 'bath')}
                  </span>
                </div>
              </section>

              <section>
                <h3 className="mb-2 font-heading text-lg font-bold text-slate-900">About this space</h3>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
                  {property.description}
                </p>
              </section>

              {property.host && (
                <section className="rounded-3xl border border-slate-100 bg-slate-50/80 p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-light text-lg font-black text-brand-primary">
                      {property.host.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-heading text-lg font-bold text-slate-900">
                          Hosted by {property.host.name}
                        </h3>
                        {property.host.is_verified_host && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                            <ShieldCheck className="h-3 w-3" />
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold text-slate-500">
                        {hostSince && <span>Hosting since {hostSince}</span>}
                        {typeof property.host.response_rate === 'number' && (
                          <span>{property.host.response_rate}% response rate</span>
                        )}
                        {property.host.response_time && <span>{property.host.response_time}</span>}
                      </div>
                      {property.host.bio && (
                        <p className="mt-3 text-sm leading-relaxed text-slate-600">{property.host.bio}</p>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {Object.keys(amenityGroups).length > 0 && (
                <section>
                  <h3 className="mb-4 font-heading text-lg font-bold text-slate-900">Amenities</h3>
                  <div className="grid gap-5 sm:grid-cols-2">
                    {Object.entries(amenityGroups).map(([category, amenities]) => (
                      <div key={category}>
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {category}
                        </p>
                        <ul className="space-y-2">
                          {amenities.map((amenity) => (
                            <li key={amenity.id} className="text-sm font-medium text-slate-700">
                              {amenity.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <h3 className="mb-4 font-heading text-lg font-bold text-slate-900">
                  Reviews
                  {property.stats.review_count > 0 && (
                    <span className="ml-2 text-sm font-semibold text-slate-400">
                      ({property.stats.review_count})
                    </span>
                  )}
                </h3>

                {property.reviews && property.reviews.length > 0 ? (
                  <div className="space-y-3">
                    {property.reviews.map((review) => (
                      <ReviewItem key={review.id} review={review} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                    No reviews yet for this space.
                  </div>
                )}
              </section>
            </div>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  )
}
