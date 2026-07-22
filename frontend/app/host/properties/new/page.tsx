'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import PropertyForm from '@/components/properties/PropertyForm'
import { propertiesApi } from '@/lib/services'

export default function HostNewPropertyPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: Record<string, unknown>, files: File[]) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const createdProperty = await propertiesApi.create(data)

      if (files.length > 0) {
        const formData = new FormData()
        files.forEach((file) => {
          formData.append('images[]', file)
        })
        await propertiesApi.uploadImages(createdProperty.id, formData)
      }

      await propertiesApi.publish(createdProperty.id, true)
      router.push('/host/properties')
    } catch (err) {
      console.error(err)
      const error = err as { response?: { data?: { message?: string } } }
      setError(error.response?.data?.message || 'Failed to create listing. Please check all fields.')
      setIsSubmitting(false)
    }
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
          <h1 className="font-heading text-3xl font-black text-slate-900 tracking-tight mb-1">List a New Space</h1>
          <p className="text-slate-500 text-sm">Add details to create your listing on the Comspace platform.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200/50 text-red-700 text-sm font-semibold max-w-3xl mx-auto">
          {error}
        </div>
      )}

      <PropertyForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  )
}
