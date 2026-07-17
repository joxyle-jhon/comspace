import api from '@/lib/api'
import type {
  AuthResponse,
  Booking,
  PaginatedResponse,
  Property,
  PropertySearchParams,
  Review,
} from '@/types'

export const authApi = {
  register: (body: { name: string; email: string; password: string; role?: string }) =>
    api.post<AuthResponse>('/auth/register', body).then((r) => r.data),

  login: (body: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', body).then((r) => r.data),

  logout: () => api.post('/auth/logout').then((r) => r.data),

  me: () => api.get<{ data: AuthResponse['user'] }>('/auth/me').then((r) => r.data),
}

export const propertiesApi = {
  list: (params: PropertySearchParams) =>
    api.get<PaginatedResponse<Property>>('/properties', { params }).then((r) => r.data),

  get: (id: number) =>
    api.get<{ data: Property }>(`/properties/${id}`).then((r) => r.data),

  create: (body: Record<string, unknown>) =>
    api.post<{ data: Property }>('/properties', body).then((r) => r.data),

  update: (id: number, body: Record<string, unknown>) =>
    api.put<{ data: Property }>(`/properties/${id}`, body).then((r) => r.data),

  publish: (id: number, published: boolean) =>
    api.patch(`/properties/${id}/publish`, { published }).then((r) => r.data),

  delete: (id: number) => api.delete(`/properties/${id}`).then((r) => r.data),

  previewPrice: (
    propertyId: number,
    params: { check_in: string; check_out: string }
  ) =>
    api
      .get<{
        nights: number
        price_per_night: number
        subtotal: number
        cleaning_fee: number
        service_fee: number
        total_amount: number
      }>(`/properties/${propertyId}/price-preview`, { params })
      .then((r) => r.data),

  reviews: (propertyId: number, page?: number) =>
    api
      .get<PaginatedResponse<Review>>(`/properties/${propertyId}/reviews`, {
        params: { page },
      })
      .then((r) => r.data),
}

export const bookingsApi = {
  list: (page?: number) =>
    api
      .get<PaginatedResponse<Booking>>('/bookings', { params: { page } })
      .then((r) => r.data),

  get: (id: number) =>
    api.get<{ data: Booking }>(`/bookings/${id}`).then((r) => r.data),

  create: (
    propertyId: number,
    body: { check_in: string; check_out: string; guest_count: number; guest_note?: string }
  ) =>
    api.post<{ data: Booking }>(`/properties/${propertyId}/bookings`, body).then((r) => r.data),

  cancel: (id: number, reason?: string) =>
    api.patch(`/bookings/${id}/cancel`, { reason }).then((r) => r.data),

  confirm: (id: number) =>
    api.patch(`/bookings/${id}/confirm`).then((r) => r.data),

  createReview: (
    bookingId: number,
    body: {
      rating: number
      comment: string
      cleanliness_rating?: number
      accuracy_rating?: number
      communication_rating?: number
      location_rating?: number
      value_rating?: number
    }
  ) =>
    api
      .post<{ data: Review }>(`/bookings/${bookingId}/reviews`, body)
      .then((r) => r.data),
}

export const reviewsApi = {
  reply: (reviewId: number, reply: string) =>
    api.post(`/reviews/${reviewId}/reply`, { reply }).then((r) => r.data),
}
