import { Friend, ApiResponse } from '@/types'
import { apiClient } from '@/lib/apiClient'
import { mockFriends, delay } from '@/services/mock/mockData'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

let friends = [...mockFriends]

export const friendService = {
  async getFriends(): Promise<ApiResponse<Friend[]>> {
    if (!USE_MOCK) return apiClient<ApiResponse<Friend[]>>('/friends')
    await delay(300)
    return {
      data: friends,
    }
  },

  async getFriendById(id: string): Promise<ApiResponse<Friend>> {
    if (!USE_MOCK) return apiClient<ApiResponse<Friend>>(`/friends/${id}`)
    await delay(200)
    const friend = friends.find((f) => f.id === id)
    if (!friend) {
      return {
        data: null as any,
        error: 'Friend not found',
      }
    }
    return {
      data: friend,
    }
  },

  async addFriend(
    userId: string,
    friendData: Omit<Friend, 'id' | 'userId' | 'addedAt'>
  ): Promise<ApiResponse<Friend>> {
    if (!USE_MOCK) return apiClient<ApiResponse<Friend>>('/friends', { method: 'POST', body: JSON.stringify({ userId, ...friendData }) })
    await delay(400)
    const newFriend: Friend = {
      ...friendData,
      userId,
      id: `friend-${Date.now()}`,
      addedAt: new Date(),
    }
    friends.push(newFriend)
    return {
      data: newFriend,
    }
  },

  async removeFriend(id: string): Promise<ApiResponse<{ success: boolean }>> {
    if (!USE_MOCK) return apiClient<ApiResponse<{ success: boolean }>>(`/friends/${id}`, { method: 'DELETE' })
    await delay(300)
    friends = friends.filter((f) => f.id !== id)
    return {
      data: { success: true },
    }
  },

  async searchFriends(query: string): Promise<ApiResponse<Friend[]>> {
    if (!USE_MOCK) return apiClient<ApiResponse<Friend[]>>(`/friends/search?query=${encodeURIComponent(query)}`)
    await delay(300)
    const lowercaseQuery = query.toLowerCase()
    return {
      data: friends.filter(
        (f) =>
          f.name.toLowerCase().includes(lowercaseQuery) ||
          f.email.toLowerCase().includes(lowercaseQuery)
      ),
    }
  },
}
