import { User, ApiResponse } from '@/types'
import { apiClient } from '@/lib/apiClient'
import { mockUsers, delay } from '@/services/mock/mockData'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export const authService = {
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    if (!USE_MOCK) return apiClient<ApiResponse<{ user: User; token: string }>>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    await delay(600)
    
    if (!email || !password) {
      return {
        data: null as any,
        error: 'Email and password are required',
      }
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

    return {
      data: {
        user,
        token: `token-${Date.now()}`,
      },
    }
  },

  async register(
    email: string,
    password: string,
    name: string
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    if (!USE_MOCK) return apiClient<ApiResponse<{ user: User; token: string }>>('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name }) })
    await delay(600)

    if (!email || !password || !name) {
      return {
        data: null as any,
        error: 'All fields are required',
      }
    }

    const existingUser = Object.values(mockUsers).find((u) => u.email === email)
    if (existingUser) {
      return {
        data: null as any,
        error: 'User already exists',
      }
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      createdAt: new Date(),
    }

    return {
      data: {
        user: newUser,
        token: `token-${Date.now()}`,
      },
    }
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
