import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PropertiesPageClient } from './PropertiesPageClient'

export const metadata: Metadata = {
  title: 'Browse Properties',
  description: 'Search and filter thousands of unique properties worldwide.',
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={null}>
      <PropertiesPageClient />
    </Suspense>
  )
}
