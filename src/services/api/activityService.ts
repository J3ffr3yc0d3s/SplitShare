import { Activity, ApiResponse, PaginationMeta } from '@/types'
import { apiClient } from '@/lib/apiClient'
import { mockActivity, delay } from '@/services/mock/mockData'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

let activities = [...mockActivity]

export const activityService = {
  async getActivities(
    page: number = 1,
    pageSize: number = 20
  ): Promise<ApiResponse<Activity[]>> {
    if (!USE_MOCK) return apiClient<ApiResponse<Activity[]>>(`/activity?page=${page}&pageSize=${pageSize}`)
    await delay(300)
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedActivities = activities.slice(start, end)

    return {
      data: paginatedActivities,
      meta: {
        page,
        pageSize,
        total: activities.length,
        hasMore: end < activities.length,
      },
    }
  },

  async getActivityById(id: string): Promise<ApiResponse<Activity>> {
    if (!USE_MOCK) return apiClient<ApiResponse<Activity>>(`/activity/${id}`)
    await delay(200)
    const activity = activities.find((a) => a.id === id)
    if (!activity) {
      return {
        data: null as any,
        error: 'Activity not found',
      }
    }
    return {
      data: activity,
    }
  },

  async recordActivity(
    activity: Omit<Activity, 'id'>
  ): Promise<ApiResponse<Activity>> {
    if (!USE_MOCK) return apiClient<ApiResponse<Activity>>('/activity', { method: 'POST', body: JSON.stringify(activity) })
    await delay(400)
    const newActivity: Activity = {
      ...activity,
      id: `activity-${Date.now()}`,
    }
    activities.unshift(newActivity) // Add to beginning
    return {
      data: newActivity,
    }
  },

  async getActivitiesByType(type: Activity['type']): Promise<ApiResponse<Activity[]>> {
    if (!USE_MOCK) return apiClient<ApiResponse<Activity[]>>(`/activity?type=${encodeURIComponent(type)}`)
    await delay(300)
    return {
      data: activities.filter((a) => a.type === type),
    }
  },

  async deleteActivity(id: string): Promise<ApiResponse<{ success: boolean }>> {
    if (!USE_MOCK) return apiClient<ApiResponse<{ success: boolean }>>(`/activity/${id}`, { method: 'DELETE' })
    await delay(300)
    activities = activities.filter((a) => a.id !== id)
    return {
      data: { success: true },
    }
  },
}
