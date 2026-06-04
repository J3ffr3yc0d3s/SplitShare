import { User, Expense, Friend, Balance, Settlement, Activity, DashboardMetrics } from '@/types'

export const mockUsers: Record<string, User> = {
  'user-1': {
    id: 'user-1',
    email: 'john@example.com',
    name: 'John Doe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    createdAt: new Date('2024-01-15'),
  },
  'user-2': {
    id: 'user-2',
    email: 'jane@example.com',
    name: 'Jane Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    createdAt: new Date('2024-01-20'),
  },
  'user-3': {
    id: 'user-3',
    email: 'mike@example.com',
    name: 'Mike Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    createdAt: new Date('2024-02-10'),
  },
}

export const mockExpenses: Expense[] = [
  {
    id: 'exp-1',
    title: 'Dinner at Italian Restaurant',
    description: 'Dinner at Italian Restaurant',
    amount: 120,
    category: 'food',
    paidBy: 'user-1',
    participants: [
      { userId: 'user-1', amount: 60 },
      { userId: 'user-2', amount: 60 },
    ],
    splitType: 'equal',
    date: new Date('2024-05-15'),
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date('2024-05-15'),
  },
  {
    id: 'exp-2',
    title: 'Movie tickets',
    description: 'Movie tickets',
    amount: 50,
    category: 'entertainment',
    paidBy: 'user-2',
    participants: [
      { userId: 'user-2', amount: 25 },
      { userId: 'user-1', amount: 25 },
    ],
    splitType: 'equal',
    date: new Date('2024-05-18'),
    createdAt: new Date('2024-05-18'),
    updatedAt: new Date('2024-05-18'),
  },
  {
    id: 'exp-3',
    title: 'Gas for road trip',
    description: 'Gas for road trip',
    amount: 80,
    category: 'transport',
    paidBy: 'user-1',
    participants: [
      { userId: 'user-1', amount: 40 },
      { userId: 'user-2', amount: 20 },
      { userId: 'user-3', amount: 20 },
    ],
    splitType: 'equal',
    date: new Date('2024-05-20'),
    createdAt: new Date('2024-05-20'),
    updatedAt: new Date('2024-05-20'),
  },
]

export const mockFriends: Friend[] = [
  {
    id: 'friend-1',
    userId: 'user-1',
    friendId: 'user-2',
    email: 'jane@example.com',
    name: 'Jane Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    addedAt: new Date('2024-01-20'),
  },
  {
    id: 'friend-2',
    userId: 'user-1',
    friendId: 'user-3',
    email: 'mike@example.com',
    name: 'Mike Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    addedAt: new Date('2024-02-10'),
  },
]

export const mockBalances: Balance[] = [
  {
    id: 'balance-1',
    userId: 'user-1',
    friendId: 'user-2',
    amount: 20, // john owes jane 20
    lastUpdated: new Date('2024-05-20'),
  },
  {
    id: 'balance-2',
    userId: 'user-1',
    friendId: 'user-3',
    amount: 20, // john is owed 20 by mike
    lastUpdated: new Date('2024-05-20'),
  },
]

export const mockSettlements: Settlement[] = [
  {
    id: 'settlement-1',
    from: 'user-2',
    to: 'user-1',
    amount: 50,
    date: new Date('2024-05-10'),
    status: 'completed',
    createdAt: new Date('2024-05-10'),
  },
]

export const mockActivity: Activity[] = [
  {
    id: 'activity-1',
    userId: 'user-1',
    type: 'expense_added',
    description: 'Added expense: Dinner at Italian Restaurant',
    relatedId: 'exp-1',
    timestamp: new Date('2024-05-15'),
  },
  {
    id: 'activity-2',
    userId: 'user-1',
    type: 'settlement',
    description: 'Settlement with Jane Smith: $50',
    relatedId: 'settlement-1',
    timestamp: new Date('2024-05-10'),
  },
  {
    id: 'activity-3',
    userId: 'user-1',
    type: 'friend_added',
    description: 'Added Jane Smith as friend',
    relatedId: 'user-2',
    timestamp: new Date('2024-01-20'),
  },
]

export const mockDashboardMetrics: DashboardMetrics = {
  totalExpenses: 250,
  totalOwed: 20,
  totalOwing: 20,
  monthlyTrend: [
    { month: 'Jan', amount: 120 },
    { month: 'Feb', amount: 150 },
    { month: 'Mar', amount: 200 },
    { month: 'Apr', amount: 180 },
    { month: 'May', amount: 250 },
  ],
  categoryBreakdown: [
    { category: 'Food', amount: 120 },
    { category: 'Entertainment', amount: 50 },
    { category: 'Transport', amount: 80 },
  ],
}

// Simulate API delay
export const delay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms))
