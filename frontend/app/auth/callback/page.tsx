'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { Loader2 } from 'lucide-react'

function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setAuth, fetchMe } = useAuthStore()

  useEffect(() => {
    const token = searchParams.get('token')
    const userParam = searchParams.get('user')
    const errorParam = searchParams.get('error')

    if (errorParam) {
      router.push(`/auth/login?error=${encodeURIComponent(errorParam)}`)
      return
    }

    if (token) {
      if (userParam) {
        try {
          const user = JSON.parse(decodeURIComponent(userParam))
          setAuth(user, token)
        } catch {
          localStorage.setItem('comspace_token', token)
          fetchMe()
        }
      } else {
        localStorage.setItem('comspace_token', token)
        fetchMe()
      }
      router.push('/')
    } else {
      router.push('/auth/login')
    }
  }, [searchParams, router, setAuth, fetchMe])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-md">
        <Loader2 className="w-5 h-5 text-brand-primary animate-spin" />
        <span className="text-xs font-semibold text-slate-700">Completing sign in...</span>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-5 h-5 text-brand-primary animate-spin" />
      </div>
    }>
      <CallbackContent />
    </Suspense>
  )
}
