'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/auth'
import { Menu, X, Search, Globe, User, LogOut, LayoutDashboard, PlusSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Navbar() {
  const pathname = usePathname()
  const { user, isAuthenticated, clearAuth } = useAuthStore()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isHome = pathname === '/'

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        scrolled || !isHome
          ? 'glass border-b border-stone-200/60 shadow-sm'
          : 'bg-transparent border-b border-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="Comspace home"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <span className="text-white font-heading font-bold text-sm">C</span>
            </div>
            <span className={cn(
              'font-heading font-bold text-xl tracking-tight transition-colors',
              scrolled || !isHome ? 'text-stone-900' : 'text-white'
            )}>
              Comspace
            </span>
          </Link>

          {/* Center nav links (desktop) */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { href: '/properties', label: 'Browse' },
              { href: '/properties?type=villa', label: 'Villas' },
              { href: '/properties?type=cabin', label: 'Cabins' },
              { href: '/properties?instant_book=true', label: 'Instant Book' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  scrolled || !isHome
                    ? 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                )}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Become a host */}
            {isAuthenticated && user?.role === 'guest' && (
              <Link
                href="/host/become"
                className={cn(
                  'hidden md:block text-sm font-medium px-3 py-1.5 rounded-lg transition-colors',
                  scrolled || !isHome
                    ? 'text-stone-700 hover:bg-stone-100'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                )}
              >
                Become a host
              </Link>
            )}

            {/* User menu / auth */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  id="user-menu-button"
                  aria-haspopup="true"
                  aria-expanded={userMenuOpen}
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-stone-200 bg-white shadow-sm hover:shadow-md transition-all"
                >
                  <Menu className="w-4 h-4 text-stone-600" />
                  <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -8 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-dropdown border border-stone-100 py-1 overflow-hidden"
                      role="menu"
                      aria-labelledby="user-menu-button"
                    >
                      <div className="px-4 py-3 border-b border-stone-100">
                        <p className="text-sm font-semibold text-stone-900">{user?.name}</p>
                        <p className="text-xs text-stone-500 capitalize">{user?.role}</p>
                      </div>
                      {user?.role === 'host' && (
                        <>
                          <MenuLink href="/host/dashboard" icon={LayoutDashboard} label="Dashboard" onClick={() => setUserMenuOpen(false)} />
                          <MenuLink href="/host/properties/new" icon={PlusSquare} label="Add Property" onClick={() => setUserMenuOpen(false)} />
                        </>
                      )}
                      <MenuLink href="/bookings" icon={Search} label="My Bookings" onClick={() => setUserMenuOpen(false)} />
                      <MenuLink href="/profile" icon={User} label="Profile" onClick={() => setUserMenuOpen(false)} />
                      <div className="border-t border-stone-100 mt-1">
                        <button
                          role="menuitem"
                          onClick={() => { clearAuth(); setUserMenuOpen(false) }}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-error hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className={cn(
                    'text-sm font-medium px-4 py-2 rounded-lg transition-colors',
                    scrolled || !isHome
                      ? 'text-stone-700 hover:bg-stone-100'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  )}
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  className="text-sm font-semibold px-4 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors shadow-sm"
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

function MenuLink({
  href, icon: Icon, label, onClick,
}: {
  href: string; icon: React.ElementType; label: string; onClick: () => void
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
    >
      <Icon className="w-4 h-4 text-stone-400" />
      {label}
    </Link>
  )
}
