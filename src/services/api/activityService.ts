import { Activity, ApiResponse } from '@/types'
import { apiFetch } from '@/lib/apiClient'
import { mockActivity, delay } from '@/services/mock/mockData'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export type ApiActivity = {
  id: string
  userId: string
  type: Activity['type']
  description: string
  relatedId?: string
  timestamp: string | Date
}

export function mapActivity(row: ApiActivity): Activity {
  const timestamp =
    row.timestamp instanceof Date ? row.timestamp : new Date(row.timestamp)

  return {
    id: row.id,
    userId: row.userId,
    type: row.type,
    description: row.description,
    relatedId: row.relatedId,
    timestamp,
  }
}

export const activityService = {
  async getActivities(
    page: number = 1,
    pageSize: number = 20,
  ): Promise<ApiResponse<Activity[]>> {
    if (!USE_MOCK) {
      const res = await apiFetch<ApiActivity[]>('/activity')
      const mapped = (res.data ?? []).map(mapActivity)
      return { data: mapped }
    }

    await delay(300)
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedActivities = mockActivity.slice(start, end)

    return {
      data: paginatedActivities,
      meta: {
        page,
        pageSize,
        total: mockActivity.length,
        hasMore: end < mockActivity.length,
      },
    }
  },
}
