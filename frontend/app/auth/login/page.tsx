'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Loader2, LogIn, Sparkles, Mail, Lock } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { getGoogleOAuthRedirectUrl } from '@/lib/api'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, login, setAuth, initialize, isLoading, error } = useAuthStore()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [localError, setLocalError] = useState<string | null>(null)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    const oauthError = searchParams.get('error')
    if (oauthError) {
      setLocalError(decodeURIComponent(oauthError))
    }
  }, [searchParams])

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    if (!formData.email || !formData.password) {
      setLocalError('Please fill in all fields')
      return
    }

    try {
      await login(formData)
    } catch (err) {
      console.error(err)
    }
  }

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true)
    window.location.href = getGoogleOAuthRedirectUrl()
  }

  const handleDevBypass = (role: 'guest' | 'host') => {
    const searchParams = new URLSearchParams(window.location.search)
    const redirect = searchParams.get('redirect') || '/'
    const mockUser = role === 'host'
      ? { id: 2, name: 'John Host', email: 'john@example.com', role: 'host' as const, host_since: '2023-01-15' }
      : { id: 1, name: 'Jane Guest', email: 'jane@example.com', role: 'guest' as const, host_since: null }
    setAuth(mockUser, `mock_google_token_${role}`)
    router.push(redirect)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 sm:p-10 space-y-8"
    >
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-light/35 text-brand-primary text-[10px] font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Welcome Back
            </span>
            <h2 className="font-heading text-3xl font-black text-slate-900 tracking-tight">
              Sign In to Comspace
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Discover and manage premium remote workspaces.
            </p>
          </div>

          {(localError || error) && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200/50 text-xs font-semibold text-red-600">
              {localError || error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-1.5 py-4 gradient-bg text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-primary/10 hover:shadow-xl hover:shadow-brand-primary/20 transition-all hover:scale-[1.02] disabled:opacity-55"
            >
              {isLoading ? (
                'Signing in...'
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-extrabold tracking-wider">
              <span className="bg-white px-3 text-slate-400">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isGoogleLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-brand-primary motion-reduce:animate-none" />
                Redirecting to Google...
              </>
            ) : (
              <>
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google
              </>
            )}
          </button>

          {/* Developer Sandbox */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Developer Sandbox</span>
            </div>
            <p className="text-slate-400 text-[10px] leading-relaxed">
              Bypass auth to inspect host dashboards, bookings, and other components with pre-configured mock states.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDevBypass('host')}
                className="py-2 px-3 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-700 hover:bg-slate-100 hover:border-slate-300 shadow-sm transition-all"
              >
                Mock Host
              </button>
              <button
                type="button"
                onClick={() => handleDevBypass('guest')}
                className="py-2 px-3 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-700 hover:bg-slate-100 hover:border-slate-300 shadow-sm transition-all"
              >
                Mock Guest
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400">
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/register"
              className="text-brand-primary font-bold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </motion.div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
