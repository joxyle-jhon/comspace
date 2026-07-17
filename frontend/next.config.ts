import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.unsplash.com' },
      { protocol: 'https', hostname: '**.pexels.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
}

export default nextConfig
