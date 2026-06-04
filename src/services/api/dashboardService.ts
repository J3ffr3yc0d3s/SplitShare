import { DashboardMetrics, ApiResponse } from '@/types'
import { apiFetch } from '@/lib/apiClient'
import { mockDashboardMetrics, delay } from '@/services/mock/mockData'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export const dashboardService = {
  async getDashboardMetrics(): Promise<ApiResponse<DashboardMetrics>> {
    if (!USE_MOCK) return apiFetch<DashboardMetrics>('/dashboard/metrics')
    await delay(500)
    return {
      data: mockDashboardMetrics,
    }
  },

  async getMonthlyTrend(): Promise<ApiResponse<DashboardMetrics['monthlyTrend']>> {
    if (!USE_MOCK) return apiFetch<DashboardMetrics['monthlyTrend']>('/dashboard/metrics/monthly-trend')
    await delay(300)
    return {
      data: mockDashboardMetrics.monthlyTrend,
    }
  },

  async getCategoryBreakdown(): Promise<ApiResponse<DashboardMetrics['categoryBreakdown']>> {
    if (!USE_MOCK) return apiFetch<DashboardMetrics['categoryBreakdown']>('/dashboard/metrics/category-breakdown')
    await delay(300)
    return {
      data: mockDashboardMetrics.categoryBreakdown,
    }
  },
}
