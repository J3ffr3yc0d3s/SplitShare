import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'

interface AuthStore {
  user: User | null
  token: string | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setIsLoading: (loading: boolean) => void
  logout: () => void
}

// Mock user for development
const mockUser: User = {
  id: '1',
  email: 'demo@example.com',
  name: 'Demo User',
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: mockUser,
      token: 'mock-token',
      isLoading: false,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
)
