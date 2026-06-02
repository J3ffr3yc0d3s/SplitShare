import { Settlement, ApiResponse } from '@/types'
import { apiClient } from '@/lib/apiClient'
import { mockSettlements, delay } from '@/services/mock/mockData'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

let settlements = [...mockSettlements]

export const settlementService = {
  async getSettlements(): Promise<ApiResponse<Settlement[]>> {
    if (!USE_MOCK) return apiClient<ApiResponse<Settlement[]>>('/settlements')
    await delay(300)
    return {
      data: settlements,
    }
  },

  async getSettlementById(id: string): Promise<ApiResponse<Settlement>> {
    if (!USE_MOCK) return apiClient<ApiResponse<Settlement>>(`/settlements/${id}`)
    await delay(200)
    const settlement = settlements.find((s) => s.id === id)
    if (!settlement) {
      return {
        data: null as any,
        error: 'Settlement not found',
      }
    }
    return {
      data: settlement,
    }
  },

  async recordSettlement(
    settlement: Omit<Settlement, 'id' | 'createdAt'>
  ): Promise<ApiResponse<Settlement>> {
    if (!USE_MOCK) return apiClient<ApiResponse<Settlement>>('/settlements', { method: 'POST', body: JSON.stringify(settlement) })
    await delay(400)
    const newSettlement: Settlement = {
      ...settlement,
      id: `settlement-${Date.now()}`,
      createdAt: new Date(),
    }
    settlements.push(newSettlement)
    return {
      data: newSettlement,
    }
  },

  async updateSettlementStatus(
    id: string,
    status: 'pending' | 'completed'
  ): Promise<ApiResponse<Settlement>> {
    if (!USE_MOCK) return apiClient<ApiResponse<Settlement>>(`/settlements/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) })
    await delay(300)
    const index = settlements.findIndex((s) => s.id === id)
    if (index === -1) {
      return {
        data: null as any,
        error: 'Settlement not found',
      }
    }
    settlements[index].status = status
    return {
      data: settlements[index],
    }
  },

  async getPendingSettlements(): Promise<ApiResponse<Settlement[]>> {
    if (!USE_MOCK) return apiClient<ApiResponse<Settlement[]>>('/settlements?status=pending')
    await delay(300)
    return {
      data: settlements.filter((s) => s.status === 'pending'),
    }
  },
}
