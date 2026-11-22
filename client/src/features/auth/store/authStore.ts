import { create } from 'zustand'
import apiInstance from '@/shared/api/axiosInstance'
import type { UsuarioAuth } from '../types/auth.types'

interface AuthState {
  user: UsuarioAuth | null
  checking: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  clearUser: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  checking: true,

  login: async (email, password) => {
    const form = new URLSearchParams()
    form.append('username', email)
    form.append('password', password)
    await apiInstance.post('/api/v1/auth/token', form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    const { data } = await apiInstance.get<UsuarioAuth>('/api/v1/auth/me')
    set({ user: data })
  },

  logout: async () => {
    await apiInstance.post('/api/v1/auth/logout').catch(() => {})
    set({ user: null })
  },

  checkAuth: async () => {
    set({ checking: true })
    try {
      const { data } = await apiInstance.get<UsuarioAuth>('/api/v1/auth/me')
      set({ user: data })
    } catch {
      set({ user: null })
    } finally {
      set({ checking: false })
    }
  },

  clearUser: () => set({ user: null }),
}))
