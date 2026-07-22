'use client'

import Link from 'next/link'

interface LogoProps {
  className?: string
  showText?: boolean
  iconOnly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function Logo({
  className = '',
  showText = true,
  iconOnly = false,
  size = 'md',
}: LogoProps) {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  }[size]

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  }[size]

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 group focus:outline-none transition-transform active:scale-95 ${className}`}
    >
      {/* Brand Icon (Location Pin + Diamond House Mark) */}
      <div className={`relative ${iconDimensions} flex items-center justify-center shrink-0`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transform group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
        >
          {/* Outer Rounded Location Arch */}
          <path
            d="M 50 10 C 27.9 10 10 27.9 10 50 C 10 65 20 78 32 85 M 50 10 C 72.1 10 90 27.9 90 50 C 90 60 85 70 78 77"
            stroke="#FF5A1F"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Inner Diamond House Outline */}
          <path
            d="M 50 32 L 78 60 L 50 88 L 22 60 Z"
            stroke="#FF5A1F"
            strokeWidth="11"
            strokeLinejoin="round"
            strokeLinecap="round"
            fill="none"
          />

          {/* 4 Window Squares in Center */}
          <rect x="42" y="52" width="7" height="7" rx="1.5" fill="#FF5A1F" />
          <rect x="51" y="52" width="7" height="7" rx="1.5" fill="#FF5A1F" />
          <rect x="42" y="61" width="7" height="7" rx="1.5" fill="#FF5A1F" />
          <rect x="51" y="61" width="7" height="7" rx="1.5" fill="#FF5A1F" />
        </svg>
      </div>

      {/* Brand Text */}
      {showText && !iconOnly && (
        <span className={`font-heading font-black tracking-tight text-slate-900 ${textSizes}`}>
          COM<span className="text-[#FF5A1F]">SPACE</span>
        </span>
      )}
    </Link>
  )
}
