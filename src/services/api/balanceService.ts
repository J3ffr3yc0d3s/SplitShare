import { Balance, ApiResponse } from '@/types'
import { apiClient } from '@/lib/apiClient'
import { mockBalances, delay } from '@/services/mock/mockData'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export const balanceService = {
  async getBalances(): Promise<ApiResponse<Balance[]>> {
    if (!USE_MOCK) return apiClient<ApiResponse<Balance[]>>('/balances')
    await delay(300)
    return {
      data: mockBalances,
    }
  },

  async getBalanceBetweenUsers(
    userId: string,
    friendId: string
  ): Promise<ApiResponse<Balance | null>> {
    if (!USE_MOCK) return apiClient<ApiResponse<Balance | null>>(`/balances?userId=${encodeURIComponent(userId)}&friendId=${encodeURIComponent(friendId)}`)
    await delay(200)
    const balance = mockBalances.find(
      (b) => (b.userId === userId && b.friendId === friendId) ||
             (b.userId === friendId && b.friendId === userId)
    )
    return {
      data: balance || null,
    }
  },

  async calculateTotalBalance(): Promise<ApiResponse<{ owedToYou: number; youOwe: number }>> {
    if (!USE_MOCK) return apiClient<ApiResponse<{ owedToYou: number; youOwe: number }>>('/balances/total')
    await delay(300)
    let owedToYou = 0
    let youOwe = 0

    mockBalances.forEach((balance) => {
      if (balance.amount > 0) {
        owedToYou += balance.amount
      } else {
        youOwe += Math.abs(balance.amount)
      }
    })

    return {
      data: {
        owedToYou,
        youOwe,
      },
    }
  },
}
