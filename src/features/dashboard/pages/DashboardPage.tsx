import { useNavigate } from 'react-router-dom'
import { useDashboardMetrics, useExpenses } from '@/hooks/useQueries'

export default function DashboardPage() {
  const navigate = useNavigate()
  const {
    data: metrics,
    isLoading: metricsLoading,
    isError: metricsError,
  } = useDashboardMetrics()
  const {
    data: expenses,
    isLoading: expensesLoading,
    isError: expensesError,
  } = useExpenses()

  const recentExpenses = expenses?.slice(0, 5) ?? []

  return (
    <div className="space-y-8 py-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        {metricsError ? (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
            Unable to load dashboard metrics.
          </div>
        ) : null}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metricsLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-xl border border-[var(--border)] bg-[var(--card)] p-6"
              >
                <div className="h-10 w-3/4 rounded bg-slate-200" />
                <div className="mt-4 h-4 w-1/2 rounded bg-slate-200" />
              </div>
            ))
          ) : (
            [
              {
                label: 'Total Expenses',
                value: metrics?.totalExpenses ?? 0,
              },
              {
                label: 'You Owe',
                value: metrics?.totalOwing ?? 0,
              },
              {
                label: "You're Owed",
                value: metrics?.totalOwed ?? 0,
              },
              {
                label: 'Friends Count',
                value: metrics?.friendsCount ?? 0,
              },
            ].map((card) => (
              <div
                key={card.label}
                className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6"
              >
                <div className="text-3xl font-semibold text-[var(--accent)]">
                  {typeof card.value === 'number'
                    ? card.value.toLocaleString()
                    : card.value}
                </div>
                <div className="mt-2 text-sm text-[var(--muted-foreground)]">
                  {card.label}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Recent Expenses</h2>
            <p className="text-sm text-[var(--muted-foreground)]">Latest activity from your expense list.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/expenses/new')}
            className="inline-flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--secondary)]"
          >
            Add Expense
          </button>
        </div>

        {expensesError ? (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
            Unable to load recent expenses.
          </div>
        ) : expensesLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="animate-pulse rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
                <div className="flex items-center gap-4">
                  <div className="h-4 w-24 rounded bg-slate-200" />
                  <div className="h-4 w-16 rounded bg-slate-200" />
                </div>
                <div className="mt-3 grid grid-cols-4 gap-4">
                  <div className="h-3 rounded bg-slate-200" />
                  <div className="h-3 rounded bg-slate-200" />
                  <div className="h-3 rounded bg-slate-200" />
                  <div className="h-3 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : recentExpenses.length === 0 ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-center text-sm text-[var(--muted-foreground)]">
            No expenses yet
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-[var(--background)]">
                <tr>
                  <th className="px-4 py-3 font-medium text-[var(--muted-foreground)]">Description</th>
                  <th className="px-4 py-3 font-medium text-[var(--muted-foreground)]">Amount</th>
                  <th className="px-4 py-3 font-medium text-[var(--muted-foreground)]">Paid By</th>
                  <th className="px-4 py-3 font-medium text-[var(--muted-foreground)]">Date</th>
                  <th className="px-4 py-3 font-medium text-[var(--muted-foreground)]">Category</th>
                </tr>
              </thead>
              <tbody>
                {recentExpenses.map((expense) => (
                  <tr
                    key={expense.id}
                    onClick={() => navigate(`/expenses/${expense.id}`)}
                    className="cursor-pointer border-t border-[var(--border)] hover:bg-[var(--secondary)]/10"
                  >
                    <td className="px-4 py-4">{expense.description || expense.title}</td>
                    <td className="px-4 py-4">${expense.amount.toFixed(2)}</td>
                    <td className="px-4 py-4">{expense.paidBy}</td>
                    <td className="px-4 py-4">{new Date(expense.date).toLocaleDateString()}</td>
                    <td className="px-4 py-4">{expense.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => navigate('/expenses/new')}
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-6 py-4 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--secondary)]/10"
        >
          Add Expense
        </button>
        <button
          type="button"
          onClick={() => navigate('/settlements')}
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-6 py-4 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--secondary)]/10"
        >
          Settle Up
        </button>
        <button
          type="button"
          onClick={() => navigate('/balances')}
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-6 py-4 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--secondary)]/10"
        >
          View Balances
        </button>
      </section>
    </div>
  )
}
