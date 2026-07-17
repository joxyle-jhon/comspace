'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/auth'
import { Menu, Search, User, LogOut, LayoutDashboard, PlusSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export function Navbar() {
  const pathname = usePathname()
  const { user, isAuthenticated, clearAuth } = useAuthStore()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isHome = pathname === '/'
  const onDarkHero = isHome && !scrolled

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
              onDarkHero ? 'text-white' : 'text-stone-900'
            )}>
              Comspace
            </span>
          </Link>

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
                  buttonVariants({ variant: 'ghost', size: 'sm' }),
                  onDarkHero
                    ? 'text-white/80 hover:text-white hover:bg-white/10'
                    : 'text-stone-600 hover:text-stone-900'
                )}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && user?.role === 'guest' && (
              <Link
                href="/host/become"
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'sm' }),
                  'hidden md:inline-flex',
                  onDarkHero
                    ? 'text-white/80 hover:text-white hover:bg-white/10'
                    : 'text-stone-700'
                )}
              >
                Become a host
              </Link>
            )}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={cn(
                    'flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1.5 shadow-sm',
                    'hover:shadow-md transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50'
                  )}
                  aria-label="Open account menu"
                >
                  <Menu className="w-4 h-4 text-stone-600" aria-hidden="true" />
                  <Avatar size="sm" className="size-7 bg-brand-500 after:border-0">
                    <AvatarFallback className="bg-brand-500 text-white text-xs font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-52 rounded-2xl p-1">
                  <DropdownMenuLabel className="px-3 py-2 font-normal">
                    <p className="text-sm font-semibold text-stone-900">{user?.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user?.role === 'host' && (
                    <>
                      <DropdownMenuItem render={<Link href="/host/dashboard" />}>
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem render={<Link href="/host/properties/new" />}>
                        <PlusSquare className="w-4 h-4" />
                        Add Property
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem render={<Link href="/bookings" />}>
                    <Search className="w-4 h-4" />
                    My Bookings
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/profile" />}>
                    <User className="w-4 h-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={clearAuth}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'sm' }),
                    onDarkHero
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-stone-700'
                  )}
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  className={cn(buttonVariants({ size: 'sm' }), 'shadow-sm')}
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
