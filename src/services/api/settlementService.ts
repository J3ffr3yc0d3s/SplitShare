import { Settlement, ApiResponse } from '@/types'
import { apiFetch } from '@/lib/apiClient'
import { mockSettlements, delay } from '@/services/mock/mockData'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

type ApiSettlement = {
  id: string
  payer_id: string
  receiver_id: string
  amount: number | string
  status: string
  note?: string | null
  created_at: string
}

export type RecordSettlementInput = {
  to: string
  amount: number
  note?: string
}

function mapSettlement(row: ApiSettlement): Settlement {
  return {
    id: row.id,
    from: row.payer_id,
    to: row.receiver_id,
    amount: Number(row.amount),
    date: new Date(row.created_at),
    status: row.status === 'completed' ? 'completed' : 'pending',
    createdAt: new Date(row.created_at),
  }
}

let settlements = [...mockSettlements]

export const settlementService = {
  async getSettlements(): Promise<ApiResponse<Settlement[]>> {
    if (!USE_MOCK) {
      const res = await apiFetch<ApiSettlement[]>('/settlements')
      return { data: (res.data ?? []).map(mapSettlement) }
    }
    await delay(300)
    return { data: settlements }
  },

  async getSettlementById(id: string): Promise<ApiResponse<Settlement>> {
    if (!USE_MOCK) {
      const res = await apiFetch<ApiSettlement>(`/settlements/${id}`)
      return { data: mapSettlement(res.data!) }
    }
    await delay(200)
    const settlement = settlements.find((s) => s.id === id)
    if (!settlement) {
      return {
        data: null as any,
        error: 'Settlement not found',
      }
    }
    return { data: settlement }
  },

  async recordSettlement(input: RecordSettlementInput): Promise<ApiResponse<Settlement>> {
    if (!USE_MOCK) {
      const res = await apiFetch<ApiSettlement>('/settlements', {
        method: 'POST',
        body: JSON.stringify({
          to: input.to,
          amount: input.amount,
          note: input.note,
        }),
      })
      return { data: mapSettlement(res.data!) }
    }
    await delay(400)
    const newSettlement: Settlement = {
      id: `settlement-${Date.now()}`,
      from: 'user-1',
      to: input.to,
      amount: input.amount,
      date: new Date(),
      status: 'completed',
      createdAt: new Date(),
    }
    settlements.push(newSettlement)
    return { data: newSettlement }
  },

  async updateSettlementStatus(
    id: string,
    status: 'pending' | 'completed',
  ): Promise<ApiResponse<Settlement>> {
    if (!USE_MOCK) {
      const res = await apiFetch<ApiSettlement>(`/settlements/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
      return { data: mapSettlement(res.data!) }
    }
    await delay(300)
    const index = settlements.findIndex((s) => s.id === id)
    if (index === -1) {
      return {
        data: null as any,
        error: 'Settlement not found',
      }
    }
    settlements[index].status = status
    return { data: settlements[index] }
  },

  async getPendingSettlements(): Promise<ApiResponse<Settlement[]>> {
    const all = await this.getSettlements()
    return {
      data: (all.data ?? []).filter((s) => s.status === 'pending'),
    }
  },
}
