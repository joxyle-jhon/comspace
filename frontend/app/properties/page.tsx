import { Suspense } from 'react'
import { PropertiesPageClient } from './PropertiesPageClient'

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <PropertiesPageClient />
    </Suspense>
  )
}
