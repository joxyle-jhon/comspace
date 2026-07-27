'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import PageLoading from '@/components/ui/PageLoading'

function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setAuth, fetchMe } = useAuthStore()
  const [message, setMessage] = useState('Completing sign in...')

  useEffect(() => {
    const completeSignIn = async () => {
      const token = searchParams.get('token')
      const userParam = searchParams.get('user')
      const errorParam = searchParams.get('error')

      if (errorParam) {
        router.push(`/auth/login?error=${encodeURIComponent(errorParam)}`)
        return
      }

      if (!token) {
        router.push('/auth/login')
        return
      }

      if (userParam) {
        try {
          const user = JSON.parse(decodeURIComponent(userParam))
          setMessage('Taking you to Comspace...')
          setAuth(user, token)
          router.push('/')
          return
        } catch {
          // Fall through to fetch profile from API
        }
      }

      localStorage.setItem('comspace_token', token)

      try {
        await fetchMe()
        setMessage('Taking you to Comspace...')
        router.push('/')
      } catch {
        localStorage.removeItem('comspace_token')
        router.push('/auth/login?error=Could not complete Google sign-in.')
      }
    }

    void completeSignIn()
  }, [searchParams, router, setAuth, fetchMe])

  return <PageLoading message={message} />
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<PageLoading message="Completing sign in..." />}>
      <CallbackContent />
    </Suspense>
  )
}
