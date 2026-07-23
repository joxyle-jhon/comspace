import { create } from 'zustand'
import { AxiosError } from 'axios'
import { api } from '@/lib/api'

export interface User {
  id: number
  name: string
  email: string
  role: 'guest' | 'host'
  host_since: string | null
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
  login: (credentials: Record<string, unknown>) => Promise<void>
  register: (data: Record<string, unknown>) => Promise<void>
  logout: () => Promise<void>
  fetchMe: () => Promise<void>
  setUser: (user: User) => void
  initialize: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  initialize: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('comspace_token')
      const userStr = localStorage.getItem('comspace_user')
      if (token && userStr) {
        set({ token, user: JSON.parse(userStr) })
      }
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.post('/auth/login', credentials)
      const { user, token } = res.data
      localStorage.setItem('comspace_token', token)
      localStorage.setItem('comspace_user', JSON.stringify(user))
      set({ user, token, isLoading: false })
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>
      set({
        error: error.response?.data?.message || 'Login failed',
        isLoading: false,
      })
      throw err
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.post('/auth/register', data)
      const { user, token } = res.data
      localStorage.setItem('comspace_token', token)
      localStorage.setItem('comspace_user', JSON.stringify(user))
      set({ user, token, isLoading: false })
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>
      set({
        error: error.response?.data?.message || 'Registration failed',
        isLoading: false,
      })
      throw err
    }
  },

  logout: async () => {
    set({ isLoading: true })
    try {
      await api.post('/auth/logout')
    } catch (err) {
      console.error('Logout request failed', err)
    } finally {
      localStorage.removeItem('comspace_token')
      localStorage.removeItem('comspace_user')
      set({ user: null, token: null, isLoading: false })
    }
  },

  setUser: (user: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('comspace_user', JSON.stringify(user))
    }
    set({ user })
  },

  fetchMe: async () => {
    try {
      const res = await api.get('/auth/me')
      const user = res.data
      localStorage.setItem('comspace_user', JSON.stringify(user))
      set({ user })
    } catch (err) {
      console.error('Failed to fetch user', err)
    }
  },
}))
