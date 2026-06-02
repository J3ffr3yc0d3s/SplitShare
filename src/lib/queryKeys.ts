export const queryKeys = {
  // Auth
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
  },

  // Expenses
  expenses: {
    all: ['expenses'] as const,
    lists: () => [...queryKeys.expenses.all, 'list'] as const,
    list: (filters?: Record<string, any>) => [...queryKeys.expenses.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.expenses.all, 'detail', id] as const,
    byCategory: (category: string) => [...queryKeys.expenses.all, 'category', category] as const,
  },

  // Friends
  friends: {
    all: ['friends'] as const,
    lists: () => [...queryKeys.friends.all, 'list'] as const,
    list: () => [...queryKeys.friends.lists()] as const,
    detail: (id: string) => [...queryKeys.friends.all, 'detail', id] as const,
  },

  // Balances
  balances: {
    all: ['balances'] as const,
    lists: () => [...queryKeys.balances.all, 'list'] as const,
    list: () => [...queryKeys.balances.lists()] as const,
    detail: (userId: string, friendId: string) => [...queryKeys.balances.all, userId, friendId] as const,
  },

  // Settlements
  settlements: {
    all: ['settlements'] as const,
    lists: () => [...queryKeys.settlements.all, 'list'] as const,
    list: (filters?: Record<string, any>) => [...queryKeys.settlements.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.settlements.all, 'detail', id] as const,
  },

  // Activity
  activity: {
    all: ['activity'] as const,
    lists: () => [...queryKeys.activity.all, 'list'] as const,
    list: (filters?: Record<string, any>) => [...queryKeys.activity.lists(), filters] as const,
  },

  // Dashboard
  dashboard: {
    all: ['dashboard'] as const,
    metrics: () => [...queryKeys.dashboard.all, 'metrics'] as const,
  },
} as const
