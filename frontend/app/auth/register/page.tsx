'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { UserPlus, Sparkles, Mail, Lock, User as UserIcon, Shield, Briefcase } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import Navbar from '@/components/layout/Navbar'

export default function RegisterPage() {
  const router = useRouter()
  const { user, register, initialize, isLoading, error } = useAuthStore()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'guest' as 'guest' | 'host',
  })
  const [localError, setLocalError] = useState<string | null>(null)

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleSelect = (role: 'guest' | 'host') => {
    setFormData((prev) => ({ ...prev, role }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    if (!formData.name || !formData.email || !formData.password) {
      setLocalError('Please fill in all fields')
      return
    }

    if (formData.password.length < 8) {
      setLocalError('Password must be at least 8 characters long')
      return
    }

    try {
      await register(formData)
    } catch (err) {
      console.error(err)
    }
  }

  const handleGoogleLogin = () => {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
    window.location.href = `${backendUrl}/auth/google/redirect`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 sm:p-10 space-y-6"
    >
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-light/35 text-brand-primary text-[10px] font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Get Started
            </span>
            <h2 className="font-heading text-3xl font-black text-slate-900 tracking-tight">
              Create an Account
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Join Comspace to book properties or host them.
            </p>
          </div>

          {(localError || error) && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200/50 text-xs font-semibold text-red-600">
              {localError || error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-3">
              <div className="space-y-1">
                <label htmlFor="name" className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <UserIcon className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm"
                    required
                  />
                </div>
              </div>

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
                    placeholder="Min. 8 characters"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Choose Account Type
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('guest')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      formData.role === 'guest'
                        ? 'border-brand-primary bg-brand-light/20 ring-2 ring-brand-primary/10'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Briefcase className={`w-5 h-5 mb-1 ${formData.role === 'guest' ? 'text-brand-primary' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold text-slate-800">Traveler</span>
                    <span className="text-[9px] text-slate-400 font-medium">Book work/live spaces</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleSelect('host')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      formData.role === 'host'
                        ? 'border-brand-primary bg-brand-light/20 ring-2 ring-brand-primary/10'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Shield className={`w-5 h-5 mb-1 ${formData.role === 'host' ? 'text-brand-primary' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold text-slate-800">Host</span>
                    <span className="text-[9px] text-slate-400 font-medium">List own properties</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-1.5 py-4 gradient-bg text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-primary/10 hover:shadow-xl hover:shadow-brand-primary/20 transition-all hover:scale-[1.02] disabled:opacity-55"
            >
              {isLoading ? (
                'Creating Account...'
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </>
              )}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-extrabold tracking-wider">
              <span className="bg-white px-3 text-slate-400">Or sign up with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all hover:scale-[1.01]"
          >
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
          </button>

          <p className="text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="text-brand-primary font-bold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
  )
}
