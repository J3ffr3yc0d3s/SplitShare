import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'
import { useExpenses } from '@/hooks/useQueries'

export default function DevPanel() {
  if (!import.meta.env.DEV) {
    return null
  }

  const [open, setOpen] = useState(true)
  const { user, token } = useAuthStore()
  const { theme } = useUIStore()
  const expensesQuery = useExpenses()

  const truncatedToken = token ? `${token.slice(0, 8)}${token.length > 8 ? '...' : ''}` : 'null'

  return (
    <div className="fixed right-4 bottom-4 z-50 max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 text-[var(--foreground)] shadow-lg shadow-black/10">
      <button
        type="button"
        className="mb-3 inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--foreground)]"
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? 'Hide Dev Panel' : 'Show Dev Panel'}
      </button>

      {open ? (
        <div className="space-y-3 text-xs">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3">
            <div className="mb-2 font-semibold">ZUSTAND: authStore</div>
            <div>User: {user?.name ?? 'null'}</div>
            <div>Token: {truncatedToken}</div>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3">
            <div className="mb-2 font-semibold">ZUSTAND: uiStore</div>
            <div>Theme: {theme}</div>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3">
            <div className="mb-2 font-semibold">TANSTACK: expenses</div>
            <div>Status: {expensesQuery.status}</div>
            <div>Count: {Array.isArray(expensesQuery.data) ? expensesQuery.data.length : 0}</div>
            {expensesQuery.error ? <div className="text-sm text-[var(--destructive)]">Error</div> : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
