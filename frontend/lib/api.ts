import axios, { AxiosAdapter } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Pre-defined mock data to keep the site alive in mock or offline mode
const MOCK_PROPERTIES = [
  {
    id: 1,
    title: 'Linen & Oak Studio',
    description: 'A beautifully designed minimalist studio apartment in the heart of Tokyo. Perfect for remote work and quiet retreats. Features natural wood finishes, cozy textures, and a state-of-the-art office workspace.',
    type: 'apartment',
    location: {
      address: '3-15-2 Shinjuku',
      city: 'Tokyo',
      state: 'Tokyo Prefecture',
      country: 'Japan',
      postal_code: '160-0022',
      latitude: 35.6905,
      longitude: 139.7049,
    },
    capacity: {
      max_guests: 2,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
    },
    pricing: {
      price_per_night: 12000, // in cents ($120)
      price_formatted: '$120',
      cleaning_fee: 3000,
      service_fee_percent: 10,
    },
    rules: {
      min_nights: 2,
      max_nights: 14,
      instant_book: true,
    },
    stats: {
      average_rating: 4.9,
      review_count: 24,
    },
    is_published: true,
    is_active: true,
    images: [
      { id: 101, url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80', caption: 'Living Space', sort_order: 1, is_cover: true },
      { id: 102, url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80', caption: 'Workspace', sort_order: 2, is_cover: false },
      { id: 103, url: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80', caption: 'Bedroom', sort_order: 3, is_cover: false },
    ],
    amenities: [
      { id: 1, name: 'High-speed Wifi', icon: 'wifi', category: 'Connectivity' },
      { id: 2, name: 'Dedicated Workspace', icon: 'laptop', category: 'Work' },
      { id: 3, name: 'Kitchen', icon: 'kitchen', category: 'Amenities' },
      { id: 4, name: 'Air Conditioning', icon: 'wind', category: 'Comfort' },
    ],
    host: {
      id: 2,
      name: 'John Host',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      host_since: '2023-01-15',
      response_rate: 98,
      average_rating: 4.85,
    },
  },
  {
    id: 2,
    title: 'Terracotta Sunset Villa',
    description: 'An expansive luxury villa in Canggu, Bali. Features a private pool, open-concept living area with signature terracotta design details, and high-speed internet. Ideal for digital nomads and group retreats.',
    type: 'villa',
    location: {
      address: 'Jalan Pantai Batu Bolong 45',
      city: 'Bali',
      state: 'Canggu',
      country: 'Indonesia',
      postal_code: '80361',
      latitude: -8.6500,
      longitude: 115.1386,
    },
    capacity: {
      max_guests: 6,
      bedrooms: 3,
      beds: 3,
      bathrooms: 3,
    },
    pricing: {
      price_per_night: 28000, // in cents ($280)
      price_formatted: '$280',
      cleaning_fee: 6000,
      service_fee_percent: 10,
    },
    rules: {
      min_nights: 3,
      max_nights: 30,
      instant_book: true,
    },
    stats: {
      average_rating: 4.95,
      review_count: 48,
    },
    is_published: true,
    is_active: true,
    images: [
      { id: 201, url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80', caption: 'Villa Exterior & Pool', sort_order: 1, is_cover: true },
      { id: 202, url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', caption: 'Lounge Area', sort_order: 2, is_cover: false },
    ],
    amenities: [
      { id: 1, name: 'High-speed Wifi', icon: 'wifi', category: 'Connectivity' },
      { id: 5, name: 'Private Pool', icon: 'droplet', category: 'Leisure' },
      { id: 3, name: 'Kitchen', icon: 'kitchen', category: 'Amenities' },
      { id: 4, name: 'Air Conditioning', icon: 'wind', category: 'Comfort' },
    ],
    host: {
      id: 2,
      name: 'John Host',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      host_since: '2023-01-15',
      response_rate: 98,
      average_rating: 4.85,
    },
  },
]

const MOCK_STATS = {
  total_properties: 2,
  total_bookings: 18,
  total_revenue: 432000,
  pending_bookings: 3,
  avg_rating: 4.92,
  recent_bookings: [
    {
      id: 501,
      check_in: '2026-08-01',
      check_out: '2026-08-05',
      guest_count: 2,
      status: 'pending',
      payment_status: 'unpaid',
      pricing: { nights: 4, price_per_night: 12000, subtotal: 48000, cleaning_fee: 3000, service_fee: 4800, total_amount: 55800, total_formatted: '$558' },
      property: MOCK_PROPERTIES[0],
      guest: { id: 10, name: 'Jane Guest', avatar: null },
      created_at: '2026-07-25T12:00:00Z',
    },
    {
      id: 502,
      check_in: '2026-08-10',
      check_out: '2026-08-15',
      guest_count: 2,
      status: 'confirmed',
      payment_status: 'paid',
      pricing: { nights: 5, price_per_night: 28000, subtotal: 140000, cleaning_fee: 6000, service_fee: 14000, total_amount: 160000, total_formatted: '$1,600' },
      property: MOCK_PROPERTIES[1],
      guest: { id: 11, name: 'Marcus Vance', avatar: null },
      created_at: '2026-07-24T09:30:00Z',
    },
  ],
  upcoming_arrivals: [
    {
      id: 502,
      check_in: '2026-08-10',
      check_out: '2026-08-15',
      guest_count: 2,
      status: 'confirmed',
      payment_status: 'paid',
      pricing: { nights: 5, price_per_night: 28000, subtotal: 140000, cleaning_fee: 6000, service_fee: 14000, total_amount: 160000, total_formatted: '$1,600' },
      property: MOCK_PROPERTIES[1],
      guest: { id: 11, name: 'Marcus Vance', avatar: null },
      created_at: '2026-07-24T09:30:00Z',
    },
  ],
}

const customAdapter: AxiosAdapter = async (config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('comspace_token') : null
  const isMock = token && token.startsWith('mock_')

  const mockResponse = (data: unknown, status = 200) => {
    return {
      data,
      status,
      statusText: status === 200 ? 'OK' : 'Error',
      headers: {},
      config,
    }
  }

  if (isMock) {
    const url = config.url || ''
    
    if (url.includes('/auth/me')) {
      let user = { id: 2, name: 'John Host', email: 'john@example.com', role: 'host', host_since: '2023-01-15' }
      if (token.includes('guest')) {
        user = { id: 1, name: 'Jane Guest', email: 'jane@example.com', role: 'guest', host_since: null }
      }
      return mockResponse(user)
    }

    if (url.includes('/host/stats')) {
      return mockResponse(MOCK_STATS)
    }

    if (url.includes('/properties')) {
      const match = url.match(/\/properties\/(\d+)/)
      if (match) {
        const id = parseInt(match[1])
        const prop = MOCK_PROPERTIES.find(p => p.id === id) || MOCK_PROPERTIES[0]
        return mockResponse({ data: prop })
      }
      if (url.includes('/price-preview')) {
        return mockResponse({
          nights: 4,
          price_per_night: 12000,
          subtotal: 48000,
          cleaning_fee: 3000,
          service_fee: 4800,
          total_amount: 55800,
        })
      }
      return mockResponse({ data: MOCK_PROPERTIES })
    }

    if (url.includes('/bookings')) {
      return mockResponse({ data: MOCK_STATS.recent_bookings })
    }

    if (url.includes('/auth/logout')) {
      return mockResponse({ success: true })
    }
    
    return mockResponse({ success: true, message: 'Mock action succeeded' })
  }

  const originalAdapter = axios.defaults.adapter
  if (!originalAdapter) {
    throw new Error('Default axios adapter is not defined')
  }

  try {
    return await originalAdapter(config)
  } catch (err) {
    const error = err as { code?: string; message?: string }
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      console.warn('Backend server offline. Serving mock frontend data.')
      const url = config.url || ''
      if (url.includes('/auth/me')) {
        return mockResponse({ id: 1, name: 'Demo Guest', email: 'guest@example.com', role: 'guest', host_since: null })
      }
      if (url.includes('/host/stats')) {
        return mockResponse(MOCK_STATS)
      }
      if (url.includes('/properties')) {
        const match = url.match(/\/properties\/(\d+)/)
        if (match) {
          const id = parseInt(match[1])
          const prop = MOCK_PROPERTIES.find(p => p.id === id) || MOCK_PROPERTIES[0]
          return mockResponse({ data: prop })
        }
        return mockResponse({ data: MOCK_PROPERTIES })
      }
      if (url.includes('/bookings')) {
        return mockResponse({ data: MOCK_STATS.recent_bookings })
      }
      return mockResponse({ success: true })
    }
    throw error
  }
}

api.defaults.adapter = customAdapter

// Auto-inject auth token from localStorage on every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('comspace_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})
