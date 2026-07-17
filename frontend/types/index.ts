// ─── Auth ──────────────────────────────────────────────────────────────────
export interface User {
  id: number
  name: string
  email: string
  role: 'guest' | 'host'
  avatar: string | null
  phone: string | null
  country: string | null
  bio?: string
  is_verified_host?: boolean
  host_since?: string
  response_rate?: number
  response_time?: string
  created_at: string
}

export interface AuthResponse {
  user: User
  token: string
}

// ─── Properties ────────────────────────────────────────────────────────────
export interface PropertyLocation {
  address: string
  city: string
  state: string | null
  country: string
  postal_code: string | null
  latitude: number | null
  longitude: number | null
}

export interface PropertyCapacity {
  max_guests: number
  bedrooms: number
  beds: number
  bathrooms: number
}

export interface PropertyPricing {
  price_per_night: number     // cents
  price_formatted: string     // "$150.00"
  cleaning_fee: number        // cents
  service_fee_percent: number
}

export interface PropertyRules {
  min_nights: number
  max_nights: number
  instant_book: boolean
}

export interface PropertyStats {
  average_rating: number
  review_count: number
}

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

export interface Property {
  id: number
  title: string
  description: string
  type: string
  location: PropertyLocation
  capacity: PropertyCapacity
  pricing: PropertyPricing
  rules: PropertyRules
  stats: PropertyStats
  is_published: boolean
  host?: User
  images?: PropertyImage[]
  amenities?: Amenity[]
  created_at: string
  updated_at: string
}

// ─── Bookings ──────────────────────────────────────────────────────────────
export interface PriceBreakdown {
  nights: number
  price_per_night: number
  subtotal: number
  cleaning_fee: number
  service_fee: number
  total_amount: number
  total_formatted: string
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded'
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded' | 'partially_refunded'

export interface Booking {
  id: number
  check_in: string
  check_out: string
  guest_count: number
  pricing: PriceBreakdown
  status: BookingStatus
  payment_status: PaymentStatus
  guest_note: string | null
  cancelled_at: string | null
  property?: Property
  guest?: User
  review?: Review | null
  created_at: string
}

// ─── Reviews ───────────────────────────────────────────────────────────────
export interface ReviewRatings {
  cleanliness: number | null
  accuracy: number | null
  communication: number | null
  location: number | null
  value: number | null
}

export interface Review {
  id: number
  rating: number
  ratings: ReviewRatings
  comment: string
  host_reply: string | null
  host_replied_at: string | null
  guest?: User
  created_at: string
}

// ─── API Pagination ────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
  }
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
}

// ─── Search Params ─────────────────────────────────────────────────────────
export interface PropertySearchParams {
  location?: string
  check_in?: string
  check_out?: string
  guests?: number
  min_price?: number
  max_price?: number
  amenities?: number[]
  type?: string
  instant_book?: boolean
  sort?: 'price_per_night' | 'average_rating' | 'created_at'
  dir?: 'asc' | 'desc'
  page?: number
  per_page?: number
}
