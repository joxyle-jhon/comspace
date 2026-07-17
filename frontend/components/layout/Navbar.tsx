'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, LogOut, PlusCircle, Home, Menu, Shield } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const router = useRouter()
  const { user, logout, initialize } = useAuthStore()
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    initialize()
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [initialize])

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent',
        scrolled
          ? 'glass shadow-md py-3 border-slate-200/50'
          : 'bg-white/40 backdrop-blur-[2px] py-4'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group focus:outline-none">
            <span className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center text-white shadow-md shadow-brand-primary/20 transform group-hover:scale-105 transition-transform duration-300">
              <div className="w-3.5 h-3.5 bg-white transform rotate-45" />
            </span>
            <span className="font-heading font-black text-xl tracking-tight text-slate-900 group-hover:opacity-80 transition-opacity">
              COM<span className="gradient-text">SPACE</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/#why-heading"
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Why Us
            </Link>
            {user?.role === 'host' ? (
              <Link
                href="/host/properties"
                className="text-sm font-semibold text-brand-primary hover:text-brand-secondary transition-colors flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                Manage Spaces
              </Link>
            ) : (
              <Link
                href="/#host-banner"
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Host your space
              </Link>
            )}
          </div>

          {/* Auth Controls */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 shadow-sm transition-all focus:outline-none"
                >
                  <Menu className="w-4 h-4 text-slate-500" />
                  <div className="w-7 h-7 rounded-full bg-brand-light flex items-center justify-center text-brand-primary font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </button>

                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-100 bg-white shadow-xl py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Signed in as</p>
                        <p className="font-semibold text-slate-800 truncate text-sm">{user.name}</p>
                        <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold uppercase tracking-wider text-brand-primary px-1.5 py-0.5 rounded bg-brand-light/45">
                          {user.role}
                        </span>
                      </div>

                      <Link
                        href="/bookings"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Shield className="w-4 h-4" />
                        My Bookings
                      </Link>

                      {user.role === 'host' && (
                        <Link
                          href="/host/properties"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <PlusCircle className="w-4 h-4" />
                          Manage Properties
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setDropdownOpen(false)
                          logout()
                          router.push('/')
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors px-3 py-1.5"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  className="gradient-bg text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full hover:shadow-lg hover:shadow-brand-primary/20 transition-all duration-300 transform hover:scale-[1.03]"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
