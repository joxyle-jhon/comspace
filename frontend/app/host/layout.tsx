'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Building, ArrowLeft, Menu, X, Sparkles } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'

export default function HostLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, token, initialize } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    // Check if the user is authenticated and is a host
    const localToken = localStorage.getItem('comspace_token')
    const localUserStr = localStorage.getItem('comspace_user')

    if (!localToken || !localUserStr) {
      router.push('/auth/login')
      return
    }

    try {
      const localUser = JSON.parse(localUserStr)
      if (localUser.role !== 'host') {
        router.push('/')
        return
      }
      queueMicrotask(() => setAuthChecked(true))
    } catch {
      router.push('/auth/login')
    }
  }, [user, token, router])

  if (!authChecked) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium text-sm">Loading host console...</p>
        </div>
      </div>
    )
  }

  const navItems = [
    {
      name: 'Dashboard',
      href: '/host/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'My Properties',
      href: '/host/properties',
      icon: Building,
    },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200/60 sticky top-0 h-screen z-20">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group focus:outline-none">
            <span className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white shadow-md shadow-brand-primary/20 transform group-hover:scale-105 transition-transform duration-300">
              <div className="w-3 h-3 bg-white transform rotate-45" />
            </span>
            <span className="font-heading font-black text-lg tracking-tight text-slate-900">
              COM<span className="gradient-text">SPACE</span>
            </span>
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary px-2 py-0.5 rounded bg-brand-light/30 border border-brand-light/50">
            Host
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/host/dashboard' && pathname.startsWith(item.href))
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'gradient-bg text-white shadow-md shadow-brand-primary/10'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Explore
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-slate-200/60 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10">
          <div className="flex items-center gap-4 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 shadow-sm focus:outline-none"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-slate-500" /> : <Menu className="w-5 h-5 text-slate-500" />}
            </button>
            <Link href="/" className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center text-white">
                <div className="w-2.5 h-2.5 bg-white transform rotate-45" />
              </span>
              <span className="font-heading font-black text-md tracking-tight text-slate-900">
                COM<span className="gradient-text">SPACE</span>
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-light/35 border border-brand-light/50 text-brand-primary text-xs font-semibold">
              <Sparkles className="w-3 h-3" />
              Welcome to your host console
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Host Mode</p>
              <p className="font-semibold text-slate-800 text-sm">{user?.name}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand-primary font-bold text-xs shadow-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="fixed top-0 left-0 bottom-0 w-64 bg-white z-40 p-6 flex flex-col border-r border-slate-200 animate-in slide-in-from-left duration-200 lg:hidden">
              <div className="flex items-center justify-between mb-8">
                <Link href="/" className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white">
                    <div className="w-3 h-3 bg-white transform rotate-45" />
                  </span>
                  <span className="font-heading font-black text-lg tracking-tight text-slate-900">
                    COM<span className="gradient-text">SPACE</span>
                  </span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 focus:outline-none"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <nav className="flex-1 space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/host/dashboard' && pathname.startsWith(item.href))
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? 'gradient-bg text-white'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>

              <div className="pt-4 border-t border-slate-100">
                <Link
                  href="/"
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Explore
                </Link>
              </div>
            </div>
          </>
        )}

        {/* Content Wrapper */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
