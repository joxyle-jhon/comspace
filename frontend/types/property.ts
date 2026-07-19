export interface PropertyImage {
  id: number
  url: string
  caption: string | null
  is_cover: boolean
}

export interface PropertyAmenity {
  id: number
  name: string
  icon: string | null
  category: string
}

export interface PropertyHost {
  id: number
  name: string
  avatar: string | null
  role: string
  bio?: string | null
  is_verified_host?: boolean
  host_since?: string | null
  response_rate?: number | null
  response_time?: string | null
}

export interface PropertyReview {
  id: number
  rating: number
  ratings: {
    cleanliness: number | null
    accuracy: number | null
    communication: number | null
    location: number | null
    value: number | null
  }
  comment: string
  host_reply: string | null
  host_replied_at: string | null
  guest?: {
    id: number
    name: string
    avatar: string | null
  }
  created_at: string
}

export interface Property {
  id: number
  title: string
  description: string
  type: string
  location: {
    address?: string
    city: string
    state?: string | null
    country: string
    postal_code?: string | null
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
    cleaning_fee?: number
    service_fee_percent?: number
  }
  rules: {
    min_nights?: number
    max_nights?: number
    instant_book: boolean
  }
  stats: {
    average_rating: number
    review_count: number
  }
  images?: PropertyImage[]
  amenities?: PropertyAmenity[]
  host?: PropertyHost
  reviews?: PropertyReview[]
}
