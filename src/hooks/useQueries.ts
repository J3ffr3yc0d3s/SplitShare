import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { expenseService } from '@/services/api/expenseService'
import { friendService } from '@/services/api/friendService'
import { balanceService } from '@/services/api/balanceService'
import { settlementService } from '@/services/api/settlementService'
import { activityService } from '@/services/api/activityService'
import { dashboardService } from '@/services/api/dashboardService'
import { queryKeys } from '@/lib/queryKeys'
import { Expense, Friend, Activity } from '@/types'

// Expense Queries
export const useExpenses = () => {
  return useQuery({
    queryKey: queryKeys.expenses.lists(),
    queryFn: () => expenseService.getExpenses().then((res) => res.data),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  })
}

export const useExpenseById = (id: string) => {
  return useQuery({
    queryKey: queryKeys.expenses.detail(id),
    queryFn: () => expenseService.getExpenseById(id).then((res) => res.data),
    refetchOnWindowFocus: false,
  })
}

export const useExpense = useExpenseById

export const useCreateExpense = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) =>
      expenseService.createExpense(expense).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics() })
      queryClient.invalidateQueries({ queryKey: queryKeys.balances.all })
    },
  })
}

export const useUpdateExpense = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Expense> }) =>
      expenseService.updateExpense(id, updates).then((res) => res.data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses.detail(id) })
    },
  })
}

export const useDeleteExpense = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => expenseService.deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all })
    },
  })
}

// Friend Queries
export const useFriends = () => {
  return useQuery({
    queryKey: queryKeys.friends.list(),
    queryFn: () => friendService.getFriends().then((res) => res.data),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
  })
}

export const useSendFriendRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (email: string) => friendService.sendFriendRequest(email).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.friends.all })
    },
  })
}

/** @deprecated Use useSendFriendRequest */
export const useAddFriend = useSendFriendRequest

export const useUpdateFriendRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string
      status: 'accepted' | 'rejected' | 'pending'
    }) => friendService.updateFriendRequest(id, status).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.friends.all })
    },
  })
}

export const useRemoveFriend = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => friendService.removeFriend(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.friends.all })
    },
  })
}

// Balance Queries
export const useBalances = () => {
  return useQuery({
    queryKey: queryKeys.balances.list(),
    queryFn: () => balanceService.getBalances().then((res) => res.data),
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}

export const useTotalBalance = () => {
  return useQuery({
    queryKey: queryKeys.balances.all,
    queryFn: () => balanceService.calculateTotalBalance().then((res) => res.data),
    refetchOnWindowFocus: false,
  })
}

// Settlement Queries
export const useSettlements = () => {
  return useQuery({
    queryKey: queryKeys.settlements.list(),
    queryFn: () => settlementService.getSettlements().then((res) => res.data),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  })
}

export const useRecordSettlement = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { to: string; amount: number; note?: string }) =>
      settlementService.recordSettlement(input).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settlements.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.balances.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics() })
    },
  })
}

// Activity Queries
export const useActivity = (page: number = 1, pageSize: number = 20) => {
  return useQuery({
    queryKey: queryKeys.activity.list({ page, pageSize }),
    queryFn: async () => {
      const res = await activityService.getActivities(page, pageSize)
      return res.data ?? []
    },
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}

// Dashboard Queries
export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.metrics(),
    queryFn: () => dashboardService.getDashboardMetrics().then((res) => res.data),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  })
}
