import type { Metadata } from 'next'
import { Inter, Outfit, Geist } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Navbar } from '@/components/layout/Navbar'
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Comspace — Find Your Perfect Space',
    template: '%s | Comspace',
  },
  description:
    'Discover unique homes, villas, and apartments for rent. Book your perfect stay with Comspace — the smarter way to travel.',
  keywords: ['vacation rental', 'property booking', 'airbnb alternative', 'short term rental'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://comspace.io',
    siteName: 'Comspace',
    title: 'Comspace — Find Your Perfect Space',
    description: 'Discover unique homes, villas, and apartments for rent.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Comspace — Find Your Perfect Space',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn(inter.variable, outfit.variable, "font-sans", geist.variable)}>
      <body className="font-body bg-stone-50 text-stone-950 antialiased">
        <Providers>
          <Navbar />
          <main id="main-content" className="min-h-screen">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
