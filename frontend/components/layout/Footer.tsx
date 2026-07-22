'use client'

import Link from 'next/link'
import Logo from './Logo'
import { Heart, Globe, Shield } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200/80 pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-100">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Logo size="lg" />
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Curated stays and work-friendly spaces designed for remote professionals, traveling creators, and digital nomads worldwide.
            </p>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 pt-2">
              <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                <Globe className="w-3.5 h-3.5 text-[#FF5A1F]" />
                English (US)
              </span>
              <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                Verified Platform
              </span>
            </div>
          </div>

          {/* Col 2: Discover */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-900">Discover Stays</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-600">
              <li>
                <Link href="/properties?type=apartment" className="hover:text-[#FF5A1F] transition-colors">
                  Creative Lofts
                </Link>
              </li>
              <li>
                <Link href="/properties?type=villa" className="hover:text-[#FF5A1F] transition-colors">
                  Coastal Villas
                </Link>
              </li>
              <li>
                <Link href="/properties?type=cabin" className="hover:text-[#FF5A1F] transition-colors">
                  Mountain Cabins
                </Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-[#FF5A1F] transition-colors">
                  High-Speed WiFi Stays
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Hosting */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-900">Hospitality</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-600">
              <li>
                <Link href="/host/become" className="hover:text-[#FF5A1F] transition-colors">
                  Host Your Space
                </Link>
              </li>
              <li>
                <Link href="/host/become" className="hover:text-[#FF5A1F] transition-colors">
                  Host Protection Guarantee
                </Link>
              </li>
              <li>
                <Link href="/host/become" className="hover:text-[#FF5A1F] transition-colors">
                  Community Guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Comspace */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-900">About</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-600">
              <li>
                <Link href="/about" className="hover:text-[#FF5A1F] transition-colors">
                  Our Mission
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#FF5A1F] transition-colors">
                  Trust & Safety
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#FF5A1F] transition-colors">
                  Why Comspace
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <p>© {new Date().getFullYear()} Comspace, Inc. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 fill-[#FF5A1F] text-[#FF5A1F]" />
            <span>for remote travelers worldwide.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
