import { useNavigate, useParams } from 'react-router-dom'
import { useExpense, useDeleteExpense } from '@/hooks/useQueries'

const formatDate = (value: string | Date) =>
  new Date(value).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

export default function ExpenseDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data: expense, isLoading, isError } = useExpense(id ?? '')
  const deleteMutation = useDeleteExpense()

  const handleDelete = async () => {
    if (!id || !expense) return
    const confirmed = window.confirm('Are you sure you want to delete this expense?')
    if (!confirmed) return

    await deleteMutation.mutateAsync(id)
    navigate('/expenses')
  }

  if (isLoading) {
    return (
      <div className="space-y-4 py-8">
        <div className="h-8 w-1/3 animate-pulse rounded bg-slate-200" />
        <div className="h-6 w-1/4 animate-pulse rounded bg-slate-200" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-16 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      </div>
    )
  }

  if (isError || !expense) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive">
        Unable to load expense details.
      </div>
    )
  }

  return (
    <div className="space-y-8 py-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{expense.title}</h1>
          <p className="text-sm text-[var(--muted-foreground)]">View full expense details and manage participants.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate('/expenses')}
            className="rounded-md border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--secondary)]"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-md border border-destructive bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/20"
            disabled={deleteMutation.isLoading}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="text-sm text-[var(--muted-foreground)]">Amount</div>
          <div className="mt-2 text-3xl font-bold text-[var(--accent)]">${expense.amount.toFixed(2)}</div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="text-sm text-[var(--muted-foreground)]">Category</div>
          <div className="mt-2 font-semibold">{expense.category}</div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="text-sm text-[var(--muted-foreground)]">Date</div>
          <div className="mt-2 font-semibold">{formatDate(expense.date)}</div>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          <div>
            <div className="text-sm text-[var(--muted-foreground)]">Paid By</div>
            <div className="mt-2 font-semibold">{expense.paidBy}</div>
          </div>
          <div>
            <div className="text-sm text-[var(--muted-foreground)]">Description</div>
            <div className="mt-2 text-sm text-[var(--foreground)]">
              {expense.description || 'No description provided.'}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="text-lg font-semibold">Participants</h2>
        <div className="mt-4 space-y-3">
          {expense.participants.length === 0 ? (
            <div className="text-sm text-[var(--muted-foreground)]">No participants added.</div>
          ) : (
            expense.participants.map((participant) => (
              <div
                key={participant.userId}
                className="flex flex-col gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="text-sm text-[var(--muted-foreground)]">User</div>
                  <div className="mt-1 font-medium">{participant.userId}</div>
                </div>
                <div>
                  <div className="text-sm text-[var(--muted-foreground)]">Share</div>
                  <div className="mt-1 font-medium">${participant.amount.toFixed(2)}</div>
                </div>
                <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted-foreground)]">
                  {((participant as any).settled ?? false) ? 'Settled' : 'Unsettled'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
