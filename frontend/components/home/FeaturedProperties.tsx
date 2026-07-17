'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { propertiesApi } from '@/lib/services'
import { PropertyCard } from '@/components/properties/PropertyCard'
import { PropertyGridSkeleton } from '@/components/properties/PropertyCardSkeleton'
import { ErrorState } from '@/components/ui/EmptyState'

export function FeaturedProperties() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['properties', 'featured'],
    queryFn: () => propertiesApi.list({ sort: 'average_rating', dir: 'desc', per_page: 6 }),
    staleTime: 5 * 60 * 1000,
  })

  return (
    <section aria-labelledby="featured-heading" className="py-16 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-brand-500 text-sm font-semibold uppercase tracking-wide mb-1">Top rated</p>
            <h2
              id="featured-heading"
              className="font-heading text-3xl font-bold text-stone-900"
            >
              Featured properties
            </h2>
          </motion.div>
          <Link
            href="/properties?sort=average_rating&dir=desc"
            className="hidden md:flex items-center gap-1.5 text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors"
          >
            View all
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        {isLoading && <PropertyGridSkeleton count={6} />}

        {isError && <ErrorState message="Failed to load featured properties." />}

        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.data.map((property, i) => (
              <PropertyCard
                key={property.id}
                property={property}
                priority={i < 3}
              />
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-600 transition-colors"
          >
            Browse all properties
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
