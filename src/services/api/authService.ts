import { User, ApiResponse } from '@/types'
import { apiClient } from '@/lib/apiClient'
import { mockUsers, delay } from '@/services/mock/mockData'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

interface AuthResponse {
  accessToken: string
  user: User
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    if (!USE_MOCK) return apiClient<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    await delay(600)
    
    if (!email || !password) {
      throw new Error('Email and password are required')
    }

    let user = Object.values(mockUsers).find((u) => u.email === email)
    
    if (!user) {
      user = {
        id: `user-${Date.now()}`,
        email,
        name: email.split('@')[0],
        createdAt: new Date(),
      }
    }

    return { user, accessToken: `token-${Date.now()}` }
  },

  async register(
    email: string,
    password: string,
    name: string
  ): Promise<AuthResponse> {
    if (!USE_MOCK) return apiClient<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name }) })
    await delay(600)

    if (!email || !password || !name) {
      throw new Error('All fields are required')
    }

    const existingUser = Object.values(mockUsers).find((u) => u.email === email)
    if (existingUser) {
      throw new Error('User already exists')
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      createdAt: new Date(),
    }

    return { user: newUser, accessToken: `token-${Date.now()}` }
  },

  async getMe(token: string): Promise<ApiResponse<User>> {
    if (!USE_MOCK) return apiClient<ApiResponse<User>>('/auth/me')
    await delay(300)
    
    if (!token) {
      return {
        data: null as any,
        error: 'Unauthorized',
      }
    }

    return {
      data: mockUsers['user-1'],
    }
  },

  async logout(): Promise<ApiResponse<{ success: boolean }>> {
    if (!USE_MOCK) return apiClient<ApiResponse<{ success: boolean }>>('/auth/logout', { method: 'POST' })
    await delay(200)
    return {
      data: { success: true },
    }
  },
}
