import { Expense, ApiResponse } from '@/types'
import { apiClient } from '@/lib/apiClient'
import { mockExpenses, delay } from '@/services/mock/mockData'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

let expenses = [...mockExpenses]

export const expenseService = {
  async getExpenses(): Promise<ApiResponse<Expense[]>> {
    if (!USE_MOCK) return apiClient<ApiResponse<Expense[]>>('/expenses')
    await delay(300)
    return {
      data: expenses,
    }
  },

  async getExpenseById(id: string): Promise<ApiResponse<Expense>> {
    if (!USE_MOCK) return apiClient<ApiResponse<Expense>>(`/expenses/${id}`)
    await delay(200)
    const expense = expenses.find((e) => e.id === id)
    if (!expense) {
      return {
        data: null as any,
        error: 'Expense not found',
      }
    }
    return {
      data: expense,
    }
  },

  async createExpense(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Expense>> {
    if (!USE_MOCK) return apiClient<ApiResponse<Expense>>('/expenses', { method: 'POST', body: JSON.stringify(expense) })
    await delay(400)
    const newExpense: Expense = {
      ...expense,
      id: `exp-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    expenses.push(newExpense)
    return {
      data: newExpense,
    }
  },

  async updateExpense(id: string, updates: Partial<Expense>): Promise<ApiResponse<Expense>> {
    if (!USE_MOCK) return apiClient<ApiResponse<Expense>>(`/expenses/${id}`, { method: 'PATCH', body: JSON.stringify(updates) })
    await delay(400)
    const index = expenses.findIndex((e) => e.id === id)
    if (index === -1) {
      return {
        data: null as any,
        error: 'Expense not found',
      }
    }
    expenses[index] = {
      ...expenses[index],
      ...updates,
      updatedAt: new Date(),
    }
    return {
      data: expenses[index],
    }
  },

  async deleteExpense(id: string): Promise<ApiResponse<{ success: boolean }>> {
    if (!USE_MOCK) return apiClient<ApiResponse<{ success: boolean }>>(`/expenses/${id}`, { method: 'DELETE' })
    await delay(300)
    expenses = expenses.filter((e) => e.id !== id)
    return {
      data: { success: true },
    }
  },

  async getExpensesByCategory(category: string): Promise<ApiResponse<Expense[]>> {
    if (!USE_MOCK) return apiClient<ApiResponse<Expense[]>>(`/expenses?category=${encodeURIComponent(category)}`)
    await delay(300)
    return {
      data: expenses.filter((e) => e.category === category),
    }
  },
}
