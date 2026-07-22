'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import PropertyForm from '@/components/properties/PropertyForm'
import { propertiesApi, Property } from '@/lib/services'

export default function HostEditPropertyPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await propertiesApi.get(id)
        setProperty(data)
      } catch (err) {
        const error = err as { response?: { data?: { message?: string } } }
        setError(error.response?.data?.message || 'Failed to load property details')
      } finally {
        setIsLoading(false)
      }
    }
    if (id) {
      fetchProperty()
    }
  }, [id])

  const handleSubmit = async (data: Record<string, unknown>, files: File[]) => {
    setIsSubmitting(true)
    setError(null)

    try {
      await propertiesApi.update(id, data)

      if (files.length > 0) {
        const formData = new FormData()
        files.forEach((file) => {
          formData.append('images[]', file)
        })
        await propertiesApi.uploadImages(id, formData)
      }

      router.push('/host/properties')
    } catch (err) {
      console.error(err)
      const error = err as { response?: { data?: { message?: string } } }
      setError(error.response?.data?.message || 'Failed to update listing. Please verify inputs.')
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 bg-slate-200 rounded-xl" />
          <div className="h-10 bg-slate-200 rounded w-1/4" />
        </div>
        <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-100 p-8 h-96" />
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/50 p-8 max-w-md mx-auto mt-12">
        <p className="text-slate-500 font-semibold mb-4">{error || 'Property not found'}</p>
        <Link
          href="/host/properties"
          className="inline-block px-6 py-2.5 bg-slate-900 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors"
        >
          Back to Listings
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center gap-4">
        <Link
          href="/host/properties"
          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 shadow-sm transition-colors text-slate-500 hover:text-slate-800"
          title="Back to properties"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-heading text-3xl font-black text-slate-900 tracking-tight mb-1">Edit Listing</h1>
          <p className="text-slate-500 text-sm">Update pricing, photos, and configurations for &quot;{property.title}&quot;.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200/50 text-red-700 text-sm font-semibold max-w-3xl mx-auto">
          {error}
        </div>
      )}

      <PropertyForm 
        initialData={property} 
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting} 
      />
    </div>
  )
}
