'use client'

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface GsapRevealProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  yOffset?: number
  className?: string
}

export default function GsapReveal({
  children,
  delay = 0,
  duration = 0.8,
  yOffset = 24,
  className = '',
}: GsapRevealProps) {
  const elRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = elRef.current
    if (!el) return

    gsap.fromTo(
      el,
      {
        opacity: 0,
        y: yOffset,
      },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease: 'power3.out',
      }
    )
  }, [delay, duration, yOffset])

  return (
    <div ref={elRef} className={className}>
      {children}
    </div>
  )
}
