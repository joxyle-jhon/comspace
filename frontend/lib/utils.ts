import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { API_URL } from './api'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const apiOrigin = API_URL.replace(/\/api\/?$/, '')

export function resolveMediaUrl(url: string): string {
  if (!url) return url

  if (url.startsWith('/storage')) {
    return `${apiOrigin}${url}`
  }

  try {
    const parsed = new URL(url)
    if (
      parsed.hostname === 'localhost' &&
      !parsed.port &&
      parsed.pathname.startsWith('/storage')
    ) {
      return `${apiOrigin}${parsed.pathname}${parsed.search}`
    }
  } catch {
    return url
  }

  return url
}

export function formatCents(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) return `1 ${singular}`
  return `${count} ${plural || singular + 's'}`
}
