'use client'

export function PropertyCardSkeleton() {
  return (
    <article aria-hidden="true" className="rounded-2xl overflow-hidden bg-white shadow-card">
      <div className="skeleton aspect-[4/3]" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-3 w-3/4 rounded" />
        <div className="flex justify-between items-center pt-1">
          <div className="skeleton h-5 w-20 rounded" />
          <div className="skeleton h-3 w-14 rounded" />
        </div>
      </div>
    </article>
  )
}

export function PropertyGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div
      role="status"
      aria-label="Loading properties"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  )
}
