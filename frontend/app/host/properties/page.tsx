'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Edit2, Trash2, MapPin, Eye, Star, EyeOff } from 'lucide-react'
import { propertiesApi, Property } from '@/lib/services'
import { formatCents } from '@/lib/utils'

export default function HostPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let isCancelled = false

    propertiesApi
      .list({ my_properties: true })
      .then((res) => {
        if (!isCancelled) {
          setProperties(res.data || [])
          setError(null)
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          setError(err.response?.data?.message || 'Failed to load properties')
        }
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false)
      })

    return () => {
      isCancelled = true
    }
  }, [reloadKey])

  const fetchProperties = async () => {
    setReloadKey((k) => k + 1)
  }

  const handleTogglePublish = async (id: number, currentStatus: boolean) => {
    setTogglingId(id)
    try {
      const updated = await propertiesApi.publish(id, !currentStatus)
      setProperties((prev) =>
        prev.map((prop) =>
          prop.id === id ? { ...prop, is_published: updated.is_published } : prop
        )
      )
    } catch (err) {
      console.error(err)
    } finally {
      setTogglingId(null)
    }
  }

  const handleDeleteProperty = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this property listing? This action cannot be undone.')) {
      return
    }
    setDeletingId(id)
    try {
      await propertiesApi.delete(id)
      setProperties((prev) => prev.filter((prop) => prop.id !== id))
    } catch (err) {
      console.error(err)
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading && properties.length === 0) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-10 bg-slate-200 rounded w-1/4" />
          <div className="h-12 bg-slate-200 rounded-full w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="bg-white rounded-3xl overflow-hidden border border-slate-100 p-4 space-y-4 h-96" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/50 p-8 max-w-md mx-auto mt-12">
        <p className="text-slate-500 font-semibold mb-4">{error}</p>
        <button
          onClick={fetchProperties}
          className="px-6 py-2.5 bg-brand-primary hover:bg-brand-secondary text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-black text-slate-900 tracking-tight mb-2">My Properties</h1>
          <p className="text-slate-500 text-sm">Create, publish, and update your listed spaces on the Comspace platform.</p>
        </div>
        <Link
          href="/host/properties/new"
          className="inline-flex items-center justify-center gap-1.5 px-6 py-3.5 gradient-bg text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-primary/10 hover:shadow-xl hover:shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          List a new space
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/50 p-8">
          <p className="text-slate-500 font-semibold text-lg mb-2">No properties listed yet</p>
          <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto">
            Ready to share your workspace or housing option? Start listing your properties to earn income from traveling professionals.
          </p>
          <Link
            href="/host/properties/new"
            className="px-6 py-3.5 gradient-bg text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-primary/10 transition-all"
          >
            Create your first listing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => {
            const coverImage = property.images?.find((img) => img.is_cover) || property.images?.[0]
            const isPublished = property.is_published

            return (
              <div
                key={property.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/40 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow relative"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 shrink-0">
                  {coverImage ? (
                    <Image
                      src={coverImage.url}
                      alt={coverImage.caption || property.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                      priority={false}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400 bg-slate-100">
                      <span className="text-xs font-semibold">No Image Uploaded</span>
                    </div>
                  )}

                  <span
                    className={`absolute top-4 left-4 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-md text-white ${
                      isPublished ? 'bg-emerald-500' : 'bg-slate-500'
                    }`}
                  >
                    {isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    {isPublished ? 'Published' : 'Draft'}
                  </span>

                  {property.stats.review_count > 0 && (
                    <span className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold shadow-sm border border-emerald-100">
                      <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                      {property.stats.average_rating.toFixed(1)}
                    </span>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">
                        {property.location.city}, {property.location.country}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-slate-900 text-base leading-snug line-clamp-1">
                      {property.title}
                    </h3>

                    <p className="text-slate-900 font-bold text-sm">
                      <span className="text-base font-black text-brand-primary">
                        {formatCents(property.pricing.price_per_night)}
                      </span>
                      <span className="text-slate-400 font-medium text-xs"> / night</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2 gap-4">
                    <button
                      onClick={() => handleTogglePublish(property.id, isPublished)}
                      disabled={togglingId === property.id}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                        isPublished
                          ? 'border-slate-200 text-slate-500 hover:bg-slate-50'
                          : 'border-brand-primary text-brand-primary hover:bg-brand-light/20'
                      } disabled:opacity-55`}
                    >
                      {togglingId === property.id
                        ? 'Updating...'
                        : isPublished
                        ? 'Unpublish'
                        : 'Publish Listing'}
                    </button>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/host/properties/${property.id}/edit`}
                        className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
                        title="Edit space"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteProperty(property.id)}
                        disabled={deletingId === property.id}
                        className="p-2 rounded-xl border border-red-100 hover:bg-red-50 text-red-600 transition-colors shadow-sm disabled:opacity-55"
                        title="Delete space"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
