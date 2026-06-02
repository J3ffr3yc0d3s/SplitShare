export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: Date
  updatedAt?: string
}

export interface Expense {
  id: string
  description: string
  amount: number
  category: 'food' | 'entertainment' | 'transport' | 'utilities' | 'shopping' | 'other'
  paidBy: string // user id
  participants: {
    userId: string
    amount: number
  }[]
  splitType: 'equal' | 'custom'
  date: Date
  createdAt: Date
  updatedAt: Date
}

export interface Friend {
  id: string
  userId: string
  friendId: string
  email: string
  name: string
  avatar?: string
  addedAt: Date
}

export interface Balance {
  id: string
  userId: string
  friendId: string
  amount: number // positive = owed to you, negative = you owe
  lastUpdated: Date
}

export interface Settlement {
  id: string
  from: string // payer user id
  to: string // receiver user id
  amount: number
  date: Date
  status: 'pending' | 'completed'
  createdAt: Date
}

export interface Activity {
  id: string
  userId: string
  type: 'expense_added' | 'expense_edited' | 'expense_deleted' | 'settlement' | 'friend_added'
  description: string
  relatedId?: string
  timestamp: Date
}

export interface DashboardMetrics {
  totalExpenses: number
  totalOwed: number
  totalOwing: number
  monthlyTrend: {
    month: string
    amount: number
  }[]
  categoryBreakdown: {
    category: string
    amount: number
  }[]
}

export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
  hasMore: boolean
}

export interface ApiResponse<T> {
  data: T
  meta?: PaginationMeta
  error?: string
}
