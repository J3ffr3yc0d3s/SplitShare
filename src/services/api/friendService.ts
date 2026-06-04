import { Friend, ApiResponse } from '@/types'
import { apiFetch } from '@/lib/apiClient'
import { mockFriends, delay } from '@/services/mock/mockData'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

let friends = [...mockFriends]

export const friendService = {
  async getFriends(): Promise<ApiResponse<Friend[]>> {
    if (!USE_MOCK) return apiFetch<Friend[]>('/friends')
    await delay(300)
    return {
      data: friends,
    }
  },

  async sendFriendRequest(email: string): Promise<ApiResponse<Friend>> {
    if (!USE_MOCK) {
      return apiFetch<Friend>('/friends', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim() }),
      })
    }
    await delay(400)
    const newFriend: Friend = {
      id: `friend-req-${Date.now()}`,
      userId: 'user-1',
      friendId: `user-${Date.now()}`,
      email: email.trim(),
      name: email.split('@')[0],
      addedAt: new Date(),
      status: 'pending',
    }
    friends.push(newFriend)
    return { data: newFriend }
  },

  async updateFriendRequest(
    id: string,
    status: 'accepted' | 'rejected' | 'pending',
  ): Promise<ApiResponse<Friend>> {
    if (!USE_MOCK) {
      return apiFetch<Friend>(`/friends/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
    }
    await delay(300)
    const index = friends.findIndex((f) => f.id === id)
    if (index === -1) {
      return { data: null as any, error: 'Friend request not found' }
    }
    friends[index] = {
      ...friends[index],
      status: status === 'accepted' ? 'accepted' : status,
    }
    return { data: friends[index] }
  },

  async getFriendById(id: string): Promise<ApiResponse<Friend>> {
    if (!USE_MOCK) return apiFetch<Friend>(`/friends/${id}`)
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

  async removeFriend(id: string): Promise<ApiResponse<{ success: boolean }>> {
    if (!USE_MOCK) return apiFetch<{ success: boolean }>(`/friends/${id}`, { method: 'DELETE' })
    await delay(300)
    friends = friends.filter((f) => f.id !== id)
    return {
      data: { success: true },
    }
  },

  async searchFriends(query: string): Promise<ApiResponse<Friend[]>> {
    if (!USE_MOCK) return apiFetch<Friend[]>(`/friends/search?query=${encodeURIComponent(query)}`)
    await delay(300)
    const lowercaseQuery = query.toLowerCase()
    return {
      data: friends.filter(
        (f) =>
          f.name.toLowerCase().includes(lowercaseQuery) ||
          f.email.toLowerCase().includes(lowercaseQuery),
      ),
    }
  },
}
