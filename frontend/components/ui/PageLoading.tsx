import { Loader2 } from 'lucide-react'

interface PageLoadingProps {
  message?: string
  fullScreen?: boolean
}

export default function PageLoading({
  message = 'Loading...',
  fullScreen = true,
}: PageLoadingProps) {
  return (
    <div
      className={
        fullScreen
          ? 'flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4'
          : 'flex flex-col items-center justify-center py-16'
      }
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-md">
        <Loader2
          className="h-5 w-5 animate-spin text-brand-primary motion-reduce:animate-none"
          aria-hidden="true"
        />
        <span className="text-xs font-semibold text-slate-700">{message}</span>
      </div>
    </div>
  )
}
