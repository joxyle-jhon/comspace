'use client'

import { use, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Bath,
  BedDouble,
  Home,
  MapPin,
  Share2,
  Heart,
  Star,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import BookingWidget from '@/components/booking/BookingWidget'
import { propertiesApi, type Property, type Review } from '@/lib/services'
import { pluralize } from '@/lib/utils'

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=80',
]

interface PageProps {
  params: Promise<{ id: string }>
}

export default function PropertyDetailPage({ params }: PageProps) {
  const { id } = use(params)

  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeImage, setActiveImage] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  useEffect(() => {
    let isCancelled = false

    propertiesApi
      .get(id)
      .then((data) => {
        if (!isCancelled) {
          setProperty(data)
          setError(null)
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setError('Property not found or unavailable.')
        }
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false)
      })

    return () => {
      isCancelled = true
    }
  }, [id])

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2500)
    }
  }

  // Gallery Photos Assembly
  const images =
    property?.images && property.images.length > 0
      ? property.images.map((img) => img.url)
      : FALLBACK_IMAGES

  const galleryImages = images.slice(0, 5)
  while (galleryImages.length < 5) {
    galleryImages.push(FALLBACK_IMAGES[galleryImages.length % FALLBACK_IMAGES.length])
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-28 pb-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/3" />
            <div className="aspect-[21/9] w-full bg-slate-200 rounded-3xl" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-6 bg-slate-200 rounded w-1/2" />
                <div className="h-20 bg-slate-200 rounded-2xl" />
                <div className="h-40 bg-slate-200 rounded-2xl" />
              </div>
              <div className="h-96 bg-slate-200 rounded-3xl" />
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (error || !property) {
    return (
      <>
        <Navbar />
        <div className="min-h-[70vh] pt-32 pb-20 bg-slate-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <h1 className="font-heading text-3xl font-black text-slate-900 mb-3">Property Unavailable</h1>
            <p className="text-slate-500 text-sm mb-6">{error || "We couldn't find the requested property."}</p>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 px-6 py-3 gradient-bg text-white rounded-full font-bold text-xs uppercase tracking-wider shadow-md hover:opacity-95 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all stays
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-28 pb-24 bg-[#FDFBF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Row */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0EB] border border-[#FF5A1F]/20 text-[#FF5A1F] text-xs font-bold uppercase tracking-wider">
                <Home className="w-3.5 h-3.5" />
                {property.type}
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-sm transition-all"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  {copiedLink ? 'Link Copied!' : 'Share'}
                </button>
                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full border ${
                    isSaved ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  } text-xs font-semibold shadow-sm transition-all`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-slate-500'}`} />
                  {isSaved ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
              {property.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
              {property.stats?.average_rating > 0 && (
                <div className="flex items-center gap-1 font-bold text-slate-900">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{property.stats.average_rating.toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">
                    ({property.stats.review_count} {pluralize(property.stats.review_count, 'review')})
                  </span>
                </div>
              )}
              <span>•</span>
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#FF5A1F]" />
                <span>
                  {property.location?.city}, {property.location?.country}
                </span>
              </div>
            </div>
          </div>

          {/* Photo Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-3xl overflow-hidden shadow-xl mb-12">
            {/* Main Feature Image */}
            <div className="md:col-span-2 relative aspect-[4/3] md:aspect-auto md:h-[440px] group cursor-pointer" onClick={() => setActiveImage(galleryImages[0])}>
              <Image
                src={galleryImages[0]}
                alt={property.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                priority
              />
              <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors" />
              <button
                type="button"
                className="md:hidden absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider"
              >
                View Photos ({galleryImages.length})
              </button>
            </div>

            {/* Side Grid 2x2 */}
            <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-3 h-[440px]">
              {galleryImages.slice(1, 5).map((imgUrl, index) => (
                <div
                  key={index}
                  className="relative h-[214px] group cursor-pointer overflow-hidden"
                  onClick={() => setActiveImage(imgUrl)}
                >
                  <Image
                    src={imgUrl}
                    alt={`${property.title} preview ${index + 2}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* Lightbox Modal */}
          {activeImage && (
            <div
              className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setActiveImage(null)}
            >
              <div className="relative max-w-5xl max-h-[90vh] w-full h-full">
                <Image src={activeImage} alt="Expanded view" fill className="object-contain" />
                <button
                  type="button"
                  onClick={() => setActiveImage(null)}
                  className="absolute top-4 right-4 text-white bg-white/20 hover:bg-white/40 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Main Detail Grid (Left: Info, Right: Booking Widget) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Main Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Host Summary Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden bg-brand-light border-2 border-brand-primary/20 shrink-0">
                    {property.host?.avatar ? (
                      <Image src={property.host.avatar} alt={property.host.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-brand-primary text-lg">
                        {property.host?.name?.charAt(0) || 'H'}
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-heading font-black text-lg text-slate-900">
                      Hosted by {property.host?.name || 'Comspace Host'}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Response rate: {property.host?.response_rate || 98}% • Fast response within an hour
                    </p>
                  </div>
                </div>

                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Verified Host
                </span>
              </div>

              {/* Capacity Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                  <Users className="w-5 h-5 text-[#FF5A1F] mx-auto mb-2" />
                  <span className="block text-xs text-slate-400 font-medium">Guests</span>
                  <span className="font-bold text-slate-900 text-sm">{property.capacity?.max_guests} max</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                  <BedDouble className="w-5 h-5 text-[#FF5A1F] mx-auto mb-2" />
                  <span className="block text-xs text-slate-400 font-medium">Bedrooms</span>
                  <span className="font-bold text-slate-900 text-sm">{property.capacity?.bedrooms} rooms</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                  <BedDouble className="w-5 h-5 text-[#FF5A1F] mx-auto mb-2" />
                  <span className="block text-xs text-slate-400 font-medium">Beds</span>
                  <span className="font-bold text-slate-900 text-sm">{property.capacity?.beds} beds</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                  <Bath className="w-5 h-5 text-[#FF5A1F] mx-auto mb-2" />
                  <span className="block text-xs text-slate-400 font-medium">Bathrooms</span>
                  <span className="font-bold text-slate-900 text-sm">{property.capacity?.bathrooms} baths</span>
                </div>
              </div>

              {/* Description Block */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="font-heading font-black text-xl text-slate-900">About this space</h3>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Amenities Grid */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
                  <h3 className="font-heading font-black text-xl text-slate-900">What this space offers</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {property.amenities.map((amenity) => (
                      <div key={amenity.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-xs font-semibold text-slate-800">{amenity.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Section */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                  <div>
                    <h3 className="font-heading font-black text-xl text-slate-900 flex items-center gap-2">
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                      {property.stats?.average_rating > 0
                        ? `${property.stats.average_rating.toFixed(1)} Rating`
                        : 'Guest Reviews'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Based on {property.stats?.review_count || 0} verified stay reviews
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-brand-light text-brand-primary font-bold text-xs">
                    {property.stats?.review_count || 0} Reviews
                  </span>
                </div>

                {property.reviews && property.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {property.reviews.map((review: Review) => (
                      <div key={review.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                              {review.guest?.name?.charAt(0) || 'G'}
                            </div>
                            <div>
                              <span className="block text-xs font-bold text-slate-900">{review.guest?.name || 'Guest'}</span>
                              <span className="text-[10px] text-slate-400">
                                {new Date(review.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-slate-100 text-xs font-bold text-slate-800">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{review.rating.toFixed(1)}</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">{review.comment}</p>

                        {review.host_reply && (
                          <div className="mt-3 p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                            <span className="font-bold text-brand-primary uppercase text-[10px] tracking-wider block">Host Reply</span>
                            <p className="text-slate-600">{review.host_reply}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic text-center py-6">
                    No guest reviews posted yet for this stay.
                  </p>
                )}
              </div>
            </div>

            {/* Right Column: Sticky Booking Widget */}
            <div className="lg:col-span-1">
              <BookingWidget property={property} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
