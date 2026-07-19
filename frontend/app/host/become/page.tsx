'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  DollarSign, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle 
} from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { authApi } from '@/lib/services'

export default function BecomeHostPage() {
  const router = useRouter()
  const { user, token, initialize, fetchMe } = useAuthStore()
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (user && user.role === 'host') {
      router.push('/host/dashboard')
    }
  }, [user, router])

  const handleBecomeHost = async () => {
    setIsUpgrading(true)
    setError(null)
    try {
      await authApi.becomeHost()
      await fetchMe()
      setIsSuccess(true)
      setTimeout(() => {
        router.push('/host/dashboard')
      }, 2000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to activate host account. Please try again.')
      setIsUpgrading(false)
    }
  }

  if (user?.role === 'host') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-semibold text-sm">Redirecting to Host Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-16 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-300">
        <div className="relative rounded-[32px] overflow-hidden shadow-2xl bg-slate-900 text-white min-h-[320px] flex items-center">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80')",
            }}
            role="presentation"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 to-transparent" />
          <div className="relative z-10 p-8 sm:p-16 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/25 border border-brand-primary/50 text-brand-primary text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Comspace Hosting
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-black leading-none tracking-tight">
              Share Your Space,<br />
              <span className="gradient-text">Earn Extra Income</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-lg leading-relaxed">
              Open your doors to remote working professionals, digital nomads, and travelers looking for flexible stays.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200/40 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-light/30 flex items-center justify-center text-brand-primary">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-lg text-slate-900">Set Your Pricing</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              You maintain total control. Choose your nightly rate, cleaning fees, and stay duration requirements.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/40 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-lg text-slate-900">Host Professionals</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Rent to verified guests seeking workspaces, stable internet, and comfortable, productive housing.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/40 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-lg text-slate-900">Secure Payments</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Get paid securely directly to your account. Booking payments are managed seamlessly by Comspace.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-200/40 shadow-lg p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6">
          <AnimatePresence mode="wait">
            {!token ? (
              <motion.div
                key="unsigned"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <h3 className="font-heading text-2xl font-black text-slate-900">Join Comspace to start hosting</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                  You need to create a traveler or host account on Comspace before you can list your space.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/auth/register"
                    className="w-full sm:w-auto px-8 py-3.5 gradient-bg text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-primary/10 transition-all hover:scale-[1.02]"
                  >
                    Create Account
                  </Link>
                  <Link
                    href="/auth/login"
                    className="w-full sm:w-auto px-8 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              </motion.div>
            ) : isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4 py-8 flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-2 animate-bounce">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-heading text-2xl font-black text-slate-900">Host Account Activated!</h3>
                <p className="text-slate-500 text-sm">Welcome aboard! Transferring you to your host dashboard...</p>
              </motion.div>
            ) : (
              <motion.div
                key="signed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <h3 className="font-heading text-2xl font-black text-slate-900">Ready to activate hosting?</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                  We will upgrade your current user profile (**{user?.name}**) to have Host permissions, giving you access to property creation and analytics panels.
                </p>

                {error && (
                  <p className="text-xs text-red-500 font-bold bg-red-50 border border-red-200/50 p-3 rounded-2xl">
                    {error}
                  </p>
                )}

                <button
                  onClick={handleBecomeHost}
                  disabled={isUpgrading}
                  className="inline-flex items-center justify-center gap-1.5 px-10 py-4 gradient-bg text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-primary/15 hover:shadow-xl hover:shadow-brand-primary/30 transition-all transform hover:scale-[1.02] disabled:opacity-55"
                >
                  {isUpgrading ? 'Upgrading Account...' : 'Upgrade to Host Account'}
                  {!isUpgrading && <ArrowRight className="w-4 h-4" />}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
