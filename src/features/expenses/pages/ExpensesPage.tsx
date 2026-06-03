import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExpenses } from '@/hooks/useQueries'

const expenseCategories = [
  { value: '', label: 'All categories' },
  { value: 'food', label: 'Food' },
  { value: 'transport', label: 'Transport' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'other', label: 'Other' },
]

const formatDate = (value: string | Date) =>
  new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

export default function ExpensesPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const { data: expenses, isLoading, isError } = useExpenses()

  const filteredExpenses = useMemo(() => {
    if (!expenses) return []
    return expenses.filter((expense) => {
      const matchesSearch = [expense.title, expense.description]
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
      const matchesCategory = category ? expense.category === category : true
      return matchesSearch && matchesCategory
    })
  }, [expenses, search, category])

  return (
    <div className="space-y-8 py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Expenses</h1>
          <p className="text-sm text-[var(--muted-foreground)]">Track your recent spending and review expense activity.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/expenses/new')}
          className="inline-flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--secondary)]"
        >
          Add Expense
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search expenses"
          className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10 sm:w-1/2"
        />
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10 sm:w-1/4"
        >
          {expenseCategories.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {isError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
          Unable to load expenses.
        </div>
      ) : null}

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
              <div className="h-6 w-3/4 rounded bg-slate-200" />
              <div className="mt-4 h-5 w-1/2 rounded bg-slate-200" />
              <div className="mt-3 flex gap-2">
                <div className="h-6 w-16 rounded bg-slate-200" />
                <div className="h-6 w-16 rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredExpenses.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-center text-sm text-[var(--muted-foreground)]">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--secondary)]/20 text-[var(--foreground)]">
            <span>💼</span>
          </div>
          <div className="font-medium">No expenses yet. Add your first one.</div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredExpenses.map((expense) => (
            <button
              key={expense.id}
              type="button"
              onClick={() => navigate(`/expenses/${expense.id}`)}
              className="text-left rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 transition hover:border-[var(--accent)]/50 hover:bg-[var(--secondary)]/10"
            >
              <div className="text-base font-semibold text-[var(--foreground)]">{expense.title}</div>
              <div className="mt-3 text-2xl font-bold text-[var(--accent)]">${expense.amount.toFixed(2)}</div>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[var(--muted-foreground)]">
                <span className="rounded-full border border-[var(--border)] px-2 py-1">{expense.category}</span>
                <span>{formatDate(expense.date)}</span>
                <span>Paid by {expense.paidBy}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
