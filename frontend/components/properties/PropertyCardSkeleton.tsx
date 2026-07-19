export default function PropertyCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-3xl border border-slate-100 bg-white">
      <div className="aspect-[4/3] bg-slate-200" />
      <div className="space-y-4 p-6">
        <div className="h-3 w-1/3 rounded bg-slate-200" />
        <div className="h-5 w-3/4 rounded bg-slate-200" />
        <div className="h-3 w-1/2 rounded bg-slate-200" />
        <div className="border-t border-slate-100 pt-4">
          <div className="h-5 w-1/3 rounded bg-slate-200" />
        </div>
      </div>
    </div>
  )
}
