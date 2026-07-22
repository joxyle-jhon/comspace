'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, LogOut, PlusCircle, Home, Menu, Shield, User as UserIcon, Sparkles, X } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import Logo from './Logo'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const router = useRouter()
  const { user, logout, initialize } = useAuthStore()
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
          ? 'glass shadow-sm py-3.5 border-slate-200/60'
          : 'bg-transparent py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Logo size="md" />

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/properties"
              className="text-sm font-semibold text-slate-700 hover:text-[#FF5A1F] transition-colors"
            >
              Find Stays
            </Link>
            <Link
              href="/about"
              className="text-sm font-semibold text-slate-700 hover:text-[#FF5A1F] transition-colors"
            >
              Why Comspace
            </Link>
            {user?.role === 'host' ? (
              <Link
                href="/host/dashboard"
                className="text-sm font-bold text-[#FF5A1F] hover:opacity-80 transition-opacity flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                Host Console
              </Link>
            ) : (
              <Link
                href="/host/become"
                className="text-xs font-bold uppercase tracking-wider text-[#FF5A1F] bg-[#FFF0EB] border border-[#FF5A1F]/20 hover:bg-[#FF5A1F] hover:text-white px-4 py-2 rounded-full transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                Host Your Space
              </Link>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 shadow-sm transition-all focus:outline-none"
                >
                  <Menu className="w-4 h-4 text-slate-500" />
                  <div className="w-7 h-7 rounded-full bg-[#FFF0EB] border border-[#FF5A1F]/30 flex items-center justify-center text-[#FF5A1F] font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </button>

                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-100 bg-white shadow-xl py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Signed in as</p>
                        <p className="font-bold text-slate-900 truncate text-sm">{user.name}</p>
                        <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold uppercase tracking-wider text-[#FF5A1F] px-2 py-0.5 rounded-full bg-[#FFF0EB]">
                          {user.role} Account
                        </span>
                      </div>

                      <Link
                        href="/bookings"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Shield className="w-4 h-4 text-slate-400" />
                        My Reservations
                      </Link>

                      <Link
                        href="/profile"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        Profile Settings
                      </Link>

                      {user.role === 'host' && (
                        <>
                          <div className="my-1 border-t border-slate-100" />
                          <Link
                            href="/host/dashboard"
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <Home className="w-4 h-4 text-slate-400" />
                            Host Dashboard
                          </Link>
                          <Link
                            href="/host/properties"
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <PlusCircle className="w-4 h-4 text-slate-400" />
                            Manage Listings
                          </Link>
                        </>
                      )}

                      <div className="my-1 border-t border-slate-100" />
                      <button
                        type="button"
                        onClick={() => {
                          setDropdownOpen(false)
                          logout()
                          router.push('/')
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="gradient-bg text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full shadow-md shadow-[#FF5A1F]/20 hover:shadow-lg transition-all duration-300 transform active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-xl border-b border-slate-200/80 px-5 py-5 space-y-2 animate-in slide-in-from-top duration-200 shadow-2xl">
          <Link
            href="/properties"
            className="flex items-center justify-between text-xs font-bold text-slate-800 py-2.5 border-b border-slate-100"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>Find Stays</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          {user ? (
            <>
              <Link
                href="/bookings"
                className="flex items-center justify-between text-xs font-bold text-slate-800 py-2.5 border-b border-slate-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>My Reservations</span>
                <Shield className="w-3.5 h-3.5 text-slate-400" />
              </Link>
              <Link
                href="/profile"
                className="flex items-center justify-between text-xs font-bold text-slate-800 py-2.5 border-b border-slate-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Profile Settings</span>
                <UserIcon className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              {user.role === 'host' ? (
                <Link
                  href="/host/dashboard"
                  className="flex items-center justify-between text-xs font-bold text-[#FF5A1F] py-2.5 border-b border-slate-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Host Dashboard</span>
                  <Home className="w-3.5 h-3.5 text-[#FF5A1F]" />
                </Link>
              ) : (
                <Link
                  href="/host/become"
                  className="flex items-center justify-between text-xs font-bold text-[#FF5A1F] py-2.5 border-b border-slate-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Host Your Space</span>
                  <PlusCircle className="w-3.5 h-3.5 text-[#FF5A1F]" />
                </Link>
              )}

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  logout()
                  router.push('/')
                }}
                className="w-full text-left text-xs font-bold text-rose-600 py-2.5 flex items-center justify-between"
              >
                <span>Sign Out</span>
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/host/become"
                className="flex items-center justify-between text-xs font-bold text-[#FF5A1F] py-2.5 border-b border-slate-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Host Your Space</span>
                <PlusCircle className="w-3.5 h-3.5 text-[#FF5A1F]" />
              </Link>
              <div className="pt-3 flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="flex-1 text-center py-2.5 rounded-full border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="flex-1 text-center py-2.5 rounded-full gradient-bg text-white text-xs font-bold uppercase tracking-wider shadow-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
