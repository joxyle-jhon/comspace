import { api } from './api'

export interface PropertyImage {
  id: number
  url: string
  caption: string | null
  sort_order: number
  is_cover: boolean
}

export interface Amenity {
  id: number
  name: string
  icon: string | null
  category: string
}

export interface Host {
  id: number
  name: string
  avatar: string | null
  host_since: string | null
  response_rate: number | null
  average_rating: number | null
}

export interface Property {
  id: number
  title: string
  description: string
  type: 'apartment' | 'house' | 'villa' | 'cabin' | 'studio' | 'loft' | 'condo' | 'other'
  location: {
    address: string
    city: string
    state: string | null
    country: string
    postal_code: string | null
    latitude: number | null
    longitude: number | null
  }
  capacity: {
    max_guests: number
    bedrooms: number
    beds: number
    bathrooms: number
  }
  pricing: {
    price_per_night: number
    price_formatted: string
    cleaning_fee: number
    service_fee_percent: number
  }
  rules: {
    min_nights: number
    max_nights: number
    instant_book: boolean
  }
  stats: {
    average_rating: number
    review_count: number
  }
  is_published: boolean
  is_active: boolean
  images: PropertyImage[]
  amenities: Amenity[]
  host: Host
}

export interface Guest {
  id: number
  name: string
  avatar: string | null
}

export interface Booking {
  id: number
  check_in: string
  check_out: string
  guest_count: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded'
  payment_status: 'unpaid' | 'paid' | 'refunded' | 'partially_refunded'
  guest_note: string | null
  pricing: {
    nights: number
    price_per_night: number
    subtotal: number
    cleaning_fee: number
    service_fee: number
    total_amount: number
    total_formatted: string
  }
  property?: Property
  guest?: Guest
  created_at: string
}

export interface HostStats {
  total_properties: number
  total_bookings: number
  total_revenue: number
  pending_bookings: number
  avg_rating: number
  recent_bookings: Booking[]
  upcoming_arrivals: Booking[]
}

export const hostApi = {
  /**
   * Fetch host statistics for the dashboard.
   */
  getStats: async (): Promise<HostStats> => {
    const res = await api.get<HostStats>('/host/stats')
    return res.data
  },
}

export const propertiesApi = {
  /**
   * List all properties, with optional query parameters.
   */
  list: async (params?: Record<string, string | number | boolean>): Promise<{ data: Property[] }> => {
    const res = await api.get('/properties', { params })
    return res.data
  },

  /**
   * Retrieve a single property by ID.
   */
  get: async (id: number | string): Promise<Property> => {
    const res = await api.get(`/properties/${id}`)
    return res.data.data
  },

  /**
   * Create a new property listing.
   */
  create: async (data: Record<string, unknown>): Promise<Property> => {
    const res = await api.post('/properties', data)
    return res.data
  },

  /**
   * Update an existing property.
   */
  update: async (id: number | string, data: Record<string, unknown>): Promise<Property> => {
    const res = await api.put(`/properties/${id}`, data)
    return res.data
  },

  /**
   * Publish or unpublish a property listing.
   */
  publish: async (id: number | string, published: boolean): Promise<{ is_published: boolean; message: string }> => {
    const res = await api.patch(`/properties/${id}/publish`, { published })
    return res.data
  },

  /**
   * Upload images for a property listing.
   */
  uploadImages: async (id: number | string, formData: FormData): Promise<{ data: PropertyImage[] }> => {
    const res = await api.post(`/properties/${id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return res.data
  },

  /**
   * Delete a property listing.
   */
  delete: async (id: number | string): Promise<{ message: string }> => {
    const res = await api.delete(`/properties/${id}`)
    return res.data
  },

  /**
   * Preview price breakdown for a stay duration.
   */
  previewPrice: async (
    id: number | string,
    params: { check_in: string; check_out: string }
  ): Promise<{
    nights: number
    price_per_night: number
    subtotal: number
    cleaning_fee: number
    service_fee: number
    total_amount: number
  }> => {
    const res = await api.get(`/properties/${id}/price-preview`, { params })
    return res.data.data || res.data
  },
}

export const bookingsApi = {
  /**
   * List all bookings for current user.
   */
  list: async (): Promise<Booking[]> => {
    const res = await api.get('/bookings')
    return res.data.data || res.data
  },

  /**
   * Get a single booking by ID.
   */
  get: async (id: number | string): Promise<Booking> => {
    const res = await api.get(`/bookings/${id}`)
    return res.data.data || res.data
  },

  /**
   * Create a new booking for a property.
   */
  create: async (
    propertyId: number | string,
    data: {
      check_in: string
      check_out: string
      guest_count: number
      guest_note?: string
    }
  ): Promise<Booking> => {
    const res = await api.post(`/properties/${propertyId}/bookings`, data)
    return res.data.data || res.data
  },

  /**
   * Confirm a booking (host action).
   */
  confirm: async (id: number | string): Promise<Booking> => {
    const res = await api.patch(`/bookings/${id}/confirm`)
    return res.data
  },

  /**
   * Cancel a booking.
   */
  cancel: async (id: number | string): Promise<Booking> => {
    const res = await api.patch(`/bookings/${id}/cancel`)
    return res.data
  },
}

export interface ReviewData {
  rating: number
  cleanliness_rating?: number
  accuracy_rating?: number
  communication_rating?: number
  location_rating?: number
  value_rating?: number
  comment: string
}

export const reviewsApi = {
  /**
   * Submit a review for a completed booking.
   */
  create: async (bookingId: number | string, data: ReviewData) => {
    const res = await api.post(`/bookings/${bookingId}/reviews`, data)
    return res.data
  },
}

export interface AuthUser {
  id: number
  name: string
  email: string
  role: 'guest' | 'host'
  host_since: string | null
}

export const authApi = {
  /**
   * Upgrade current user to a host.
   */
  becomeHost: async (): Promise<{ message: string; user: AuthUser }> => {
    const res = await api.post('/auth/become-host')
    return res.data
  },

  /**
   * Update current user profile details.
   */
  updateProfile: async (data: { name: string; email: string }): Promise<{ message: string; user: AuthUser }> => {
    const res = await api.put('/auth/profile', data)
    return res.data
  },

  /**
   * Change current user password.
   */
  updatePassword: async (data: { current_password: string; password: string; password_confirmation: string }): Promise<{ message: string }> => {
    const res = await api.put('/auth/password', data)
    return res.data
  },
}
