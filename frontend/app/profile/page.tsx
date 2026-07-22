'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useAuthStore } from '@/store/useAuthStore'
import { authApi } from '@/lib/services'
import {
  User as UserIcon,
  Lock,
  Mail,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  KeyRound,
} from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const { user, setUser, token } = useAuthStore()

  const [activeTab, setActiveTab] = useState<'info' | 'security'>('info')

  // Profile Info Form State
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  // Auth guard
  useEffect(() => {
    const localToken = typeof window !== 'undefined' ? localStorage.getItem('comspace_token') : null
    if (!user && !token && !localToken) {
      router.push('/auth/login?redirect=/profile')
    }
  }, [user, token, router])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingProfile(true)
    setProfileSuccess(null)
    setProfileError(null)

    try {
      const res = await authApi.updateProfile({ name, email })
      if (res.user) {
        setUser(res.user)
      }
      setProfileSuccess('Profile details updated successfully!')
      setTimeout(() => setProfileSuccess(null), 3000)
    } catch (err) {
      const apiErr = err as { response?: { data?: { message?: string } } }
      setProfileError(apiErr.response?.data?.message || 'Could not update profile. Please try again.')
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.')
      return
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.')
      return
    }

    setIsSavingPassword(true)
    setPasswordSuccess(null)
    setPasswordError(null)

    try {
      await authApi.updatePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      })
      setPasswordSuccess('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setPasswordSuccess(null), 3000)
    } catch (err) {
      const apiErr = err as { response?: { data?: { message?: string } } }
      setPasswordError(apiErr.response?.data?.message || 'Current password was incorrect. Please try again.')
    } finally {
      setIsSavingPassword(false)
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FDFBF9] pt-36 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm mb-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-[#FFF0EB] border-2 border-[#FF5A1F]/30 flex items-center justify-center text-[#FF5A1F] font-black text-2xl shadow-sm shrink-0">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="font-heading font-black text-2xl text-slate-900">
                  {user?.name || 'Account Settings'}
                </h1>
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-[#FF5A1F] px-2.5 py-0.5 rounded-full bg-[#FFF0EB]">
                  {user?.role || 'Guest'} Account
                </span>
              </div>
              <p className="text-xs text-slate-500">{user?.email}</p>
              {user?.host_since && (
                <p className="text-[10px] font-bold text-slate-400">
                  Member since {new Date(user.host_since).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              )}
            </div>

            {user?.role !== 'host' && (
              <button
                type="button"
                onClick={() => router.push('/host/become')}
                className="px-5 py-2.5 rounded-full gradient-bg text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition-all shrink-0 flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                Become a Host
              </button>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-3 mb-8 border-b border-slate-200/80 pb-3">
            <button
              type="button"
              onClick={() => setActiveTab('info')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'info'
                  ? 'gradient-bg text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              Personal Info
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'security'
                  ? 'gradient-bg text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              <Lock className="w-4 h-4" />
              Security & Password
            </button>
          </div>

          {/* Tab 1: Personal Info */}
          {activeTab === 'info' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="font-heading font-black text-xl text-slate-900 mb-1">
                  Personal Information
                </h2>
                <p className="text-xs text-slate-500">
                  Update your basic contact details and display preferences.
                </p>
              </div>

              {profileSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              {profileError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{profileError}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-5">
                <div className="space-y-1.5">
                  <label htmlFor="user-name" className="block text-xs font-bold text-slate-800">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="user-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#FF5A1F] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="user-email" className="block text-xs font-bold text-slate-800">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="user-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#FF5A1F] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="px-6 py-3 rounded-full gradient-bg text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#FF5A1F]/20 hover:shadow-lg disabled:opacity-50 transition-all"
                  >
                    {isSavingProfile ? 'Saving Changes...' : 'Save Profile Details'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tab 2: Security & Password */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="font-heading font-black text-xl text-slate-900 mb-1">
                  Change Password
                </h2>
                <p className="text-xs text-slate-500">
                  Ensure your account is protected with a strong 8+ character password.
                </p>
              </div>

              {passwordSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              {passwordError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="space-y-5">
                <div className="space-y-1.5">
                  <label htmlFor="current-password" className="block text-xs font-bold text-slate-800">
                    Current Password
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="current-password"
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#FF5A1F] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="new-password" className="block text-xs font-bold text-slate-800">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="new-password"
                      type="password"
                      required
                      minLength={8}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#FF5A1F] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="confirm-password" className="block text-xs font-bold text-slate-800">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="confirm-password"
                      type="password"
                      required
                      minLength={8}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#FF5A1F] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSavingPassword}
                    className="px-6 py-3 rounded-full gradient-bg text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#FF5A1F]/20 hover:shadow-lg disabled:opacity-50 transition-all"
                  >
                    {isSavingPassword ? 'Updating Password...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
