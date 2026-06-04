import { Expense, ApiResponse } from '@/types'
import { apiFetch } from '@/lib/apiClient'
import { mockExpenses, delay } from '@/services/mock/mockData'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

let expenses = [...mockExpenses]

/** Raw expense shape from GET /api/expenses (Prisma / NestJS). */
export interface ApiExpense {
  id: string
  title: string
  description: string | null
  amount: string | number
  paid_by: string
  group_id?: string | null
  category: string
  expense_date: string
  created_by: string
  created_at: string | null
  expense_participants?: ApiExpenseParticipant[]
}

export interface ApiExpenseParticipant {
  id: string
  expense_id: string
  user_id: string
  share_amount: string | number
  is_settled: boolean
}

const expenseCategories: Expense['category'][] = [
  'food',
  'entertainment',
  'transport',
  'utilities',
  'shopping',
  'general',
  'other',
]

function toNumber(value: string | number): number {
  return typeof value === 'number' ? value : Number(value)
}

function toExpenseCategory(category: string): Expense['category'] {
  if (expenseCategories.includes(category as Expense['category'])) {
    return category as Expense['category']
  }
  return 'other'
}

export function mapExpense(api: ApiExpense): Expense {
  const createdAt = api.created_at ?? api.expense_date

  return {
    id: api.id,
    title: api.title,
    description: api.description ?? '',
    amount: toNumber(api.amount),
    category: toExpenseCategory(api.category),
    paidBy: api.paid_by,
    participants: (api.expense_participants ?? []).map((participant) => ({
      userId: participant.user_id,
      amount: toNumber(participant.share_amount),
    })),
    splitType: 'equal',
    date: new Date(api.expense_date),
    createdAt: new Date(createdAt),
    updatedAt: new Date(createdAt),
  }
}

function mapExpenseList(apiExpenses: ApiExpense[]): Expense[] {
  return apiExpenses.map(mapExpense)
}

export const expenseService = {
  async getExpenses(): Promise<ApiResponse<Expense[]>> {
    if (!USE_MOCK) {
      const response = await apiFetch<ApiExpense[]>('/expenses')
      return { data: mapExpenseList(response.data) }
    }
    await delay(300)
    return {
      data: expenses,
    }
  },

  async getExpenseById(id: string): Promise<ApiResponse<Expense>> {
    if (!USE_MOCK) {
      const response = await apiFetch<ApiExpense>(`/expenses/${id}`)
      return { data: mapExpense(response.data) }
    }
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
    if (!USE_MOCK) {
      const response = await apiFetch<ApiExpense>('/expenses', {
        method: 'POST',
        body: JSON.stringify(expense),
      })
      return { data: mapExpense(response.data) }
    }
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
    if (!USE_MOCK) {
      const response = await apiFetch<ApiExpense>(`/expenses/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      })
      return { data: mapExpense(response.data) }
    }
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
    if (!USE_MOCK) return apiFetch<{ success: boolean }>(`/expenses/${id}`, { method: 'DELETE' })
    await delay(300)
    expenses = expenses.filter((e) => e.id !== id)
    return {
      data: { success: true },
    }
  },

  async getExpensesByCategory(category: string): Promise<ApiResponse<Expense[]>> {
    if (!USE_MOCK) {
      const response = await apiFetch<ApiExpense[]>(`/expenses?category=${encodeURIComponent(category)}`)
      return { data: mapExpenseList(response.data) }
    }
    await delay(300)
    return {
      data: expenses.filter((e) => e.category === category),
    }
  },
}
