'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, Shield, Briefcase, Loader2, ArrowRight } from 'lucide-react'
const MOCK_ACCOUNTS = [
  {
    name: 'Jane Guest (Traveler)',
    email: 'jane.guest@comspace.com',
    role: 'guest' as const,
    avatarColor: 'bg-emerald-100 text-emerald-700',
    host_since: null,
  },
  {
    name: 'John Host (Owner)',
    email: 'john.host@comspace.com',
    role: 'host' as const,
    avatarColor: 'bg-blue-100 text-blue-700',
    host_since: '2023-01-15',
  },
  {
    name: 'Test User (Standard)',
    email: 'test@example.com',
    role: 'host' as const,
    avatarColor: 'bg-indigo-100 text-indigo-700',
    host_since: '2024-03-10',
  },
]

export default function GoogleMockLoginPage() {
  const router = useRouter()
  // No setAuth needed here as redirect callback handles it.
  
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [selectedUser, setSelectedUser] = useState<typeof MOCK_ACCOUNTS[0] | null>(null)
  const [showCustomForm, setShowCustomForm] = useState(false)
  
  const [customData, setCustomData] = useState({
    name: '',
    email: '',
    role: 'guest' as 'guest' | 'host',
  })
  const [formError, setFormError] = useState<string | null>(null)

  const triggerCallbackRedirect = (user: typeof MOCK_ACCOUNTS[0] | { name: string; email: string; role: 'guest' | 'host'; host_since: string | null }) => {
    setIsSigningIn(true)
    
    // Simulate API delay
    setTimeout(() => {
      // Create user details in identical format to backend responses
      const userData = {
        id: Math.floor(Math.random() * 1000) + 10,
        name: user.name,
        email: user.email,
        role: user.role,
        host_since: user.host_since,
      }
      
      const token = `mock_google_token_${user.role}_${Date.now()}`
      const encodedUser = encodeURIComponent(JSON.stringify(userData))
      
      // Navigate to callback page, which will save everything and complete login
      router.push(`/auth/callback?token=${token}&user=${encodedUser}`)
    }, 1500)
  }

  const handleAccountSelect = (account: typeof MOCK_ACCOUNTS[0]) => {
    setSelectedUser(account)
    triggerCallbackRedirect(account)
  }

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!customData.name || !customData.email) {
      setFormError('Please enter both name and email address')
      return
    }

    const newAccount = {
      name: customData.name,
      email: customData.email,
      role: customData.role,
      host_since: customData.role === 'host' ? new Date().toISOString().split('T')[0] : null,
    }

    triggerCallbackRedirect(newAccount)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 sm:p-10 space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-500 text-[10px] font-extrabold uppercase tracking-wider">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
            </svg>
            Google Identity
          </span>
        </div>
        <h2 className="font-heading text-2xl font-black text-slate-900 tracking-tight">
          Choose an account
        </h2>
        <p className="text-slate-400 text-xs">
          to continue to <span className="font-bold text-[#FF5A1F]">Comspace</span>
        </p>
      </div>

      <AnimatePresence mode="wait">
        {isSigningIn ? (
          <motion.div
            key="signing-in"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="py-12 flex flex-col items-center justify-center space-y-4 text-center"
          >
            <Loader2 className="w-10 h-10 text-[#FF5A1F] animate-spin" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-800">Signing you in...</p>
              <p className="text-xs text-slate-400">
                {selectedUser ? selectedUser.email : customData.email}
              </p>
            </div>
          </motion.div>
        ) : !showCustomForm ? (
          <motion.div
            key="account-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Account List */}
            <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50">
              {MOCK_ACCOUNTS.map((acc, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleAccountSelect(acc)}
                  className="w-full flex items-center gap-3.5 p-4 text-left hover:bg-slate-50 transition-all group"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${acc.avatarColor}`}>
                    {acc.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate group-hover:text-[#FF5A1F] transition-colors">
                      {acc.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">{acc.email}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#FF5A1F] group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>

            {/* Custom Account Toggle */}
            <button
              type="button"
              onClick={() => setShowCustomForm(true)}
              className="w-full py-3.5 px-4 bg-white border border-slate-200 border-dashed rounded-2xl text-xs font-bold text-slate-500 hover:bg-slate-50 hover:border-slate-300 flex items-center justify-center gap-2 transition-all"
            >
              <User className="w-4 h-4" />
              Use another account
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="custom-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {formError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200/50 text-[11px] font-semibold text-red-600">
                {formError}
              </div>
            )}

            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <label htmlFor="custom-name" className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      id="custom-name"
                      value={customData.name}
                      onChange={(e) => setCustomData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Jane Doe"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/20 text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="custom-email" className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      id="custom-email"
                      value={customData.email}
                      onChange={(e) => setCustomData((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="jane@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/20 text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Select Account Role
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCustomData((prev) => ({ ...prev, role: 'guest' }))}
                      className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        customData.role === 'guest'
                          ? 'border-[#FF5A1F] bg-orange-50/30 font-bold text-slate-800'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                      }`}
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      <span className="text-xs">Traveler</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCustomData((prev) => ({ ...prev, role: 'host' }))}
                      className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        customData.role === 'host'
                          ? 'border-[#FF5A1F] bg-orange-50/30 font-bold text-slate-800'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span className="text-xs">Host</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomForm(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#FF5A1F] hover:bg-[#e04e18] text-white rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1"
                >
                  Sign In
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-2 text-[10px] text-slate-400 text-center leading-relaxed">
        To continue, Google will share your name, email address, language preference, and profile picture with Comspace.
      </div>
    </motion.div>
  )
}
