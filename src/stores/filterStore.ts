import { create } from 'zustand'

interface FilterStore {
  // Expense filters
  expenseCategory: string | null
  expenseDateRange: { start: Date | null; end: Date | null }
  expenseSearch: string

  setExpenseCategory: (category: string | null) => void
  setExpenseDateRange: (start: Date | null, end: Date | null) => void
  setExpenseSearch: (search: string) => void
  resetExpenseFilters: () => void
}

export const useFilterStore = create<FilterStore>((set) => ({
  expenseCategory: null,
  expenseDateRange: { start: null, end: null },
  expenseSearch: '',

  setExpenseCategory: (category) => set({ expenseCategory: category }),

  setExpenseDateRange: (start, end) =>
    set({
      expenseDateRange: { start, end },
    }),

  setExpenseSearch: (search) => set({ expenseSearch: search }),

  resetExpenseFilters: () =>
    set({
      expenseCategory: null,
      expenseDateRange: { start: null, end: null },
      expenseSearch: '',
    }),
}))
