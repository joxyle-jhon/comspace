'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, Home, Search } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  title?: string
  description?: string
  action?: { label: string; href: string }
  icon?: React.ReactNode
}

export function EmptyState({
  title = 'Nothing here yet',
  description = 'Try adjusting your filters or search a different location.',
  action,
  icon,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-24 px-6 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mb-6">
        {icon ?? <Home className="w-8 h-8 text-stone-400" aria-hidden="true" />}
      </div>
      <h2 className="font-heading text-xl font-semibold text-stone-800 mb-2">{title}</h2>
      <p className="text-stone-500 max-w-sm text-sm leading-relaxed mb-6">{description}</p>
      {action && (
        <Link
          href={action.href}
          className={cn(buttonVariants({ size: 'xl' }), 'inline-flex gap-2')}
        >
          <Search className="w-4 h-4" aria-hidden="true" />
          {action.label}
        </Link>
      )}
    </motion.div>
  )
}

export function ErrorState({ message = 'Something went wrong. Please try again.' }: { message?: string }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center py-24 px-6 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8 text-destructive" aria-hidden="true" />
      </div>
      <h2 className="font-heading text-xl font-semibold text-stone-800 mb-2">Oops!</h2>
      <p className="text-stone-500 max-w-sm text-sm">{message}</p>
    </div>
  )
}
