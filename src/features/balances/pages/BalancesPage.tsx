import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBalances, useFriends } from '@/hooks/useQueries'

const formatDate = (value: string | Date) =>
  new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

export default function BalancesPage() {
  const navigate = useNavigate()
  const { data: balances, isLoading, isError } = useBalances()
  const { data: friends } = useFriends()

  const friendMap = useMemo(
    () =>
      new Map(
        (friends ?? []).map((friend) => [friend.friendId, friend]),
      ),
    [friends],
  )

  const totalOwed = useMemo(
    () =>
      balances?.reduce((sum, balance) => (balance.amount > 0 ? sum + balance.amount : sum), 0) ?? 0,
    [balances],
  )

  const totalYouOwe = useMemo(
    () =>
      balances?.reduce((sum, balance) => (balance.amount < 0 ? sum + Math.abs(balance.amount) : sum), 0) ?? 0,
    [balances],
  )

  return (
    <div className="space-y-8 py-8">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="text-sm font-medium text-[var(--muted-foreground)]">Total You Owe</div>
          <div className="mt-3 text-3xl font-semibold text-red-500">${totalYouOwe.toFixed(2)}</div>
          <div className="mt-2 text-sm text-[var(--muted-foreground)]">Sum of all balances where you owe others.</div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="text-sm font-medium text-[var(--muted-foreground)]">Total You're Owed</div>
          <div className="mt-3 text-3xl font-semibold text-green-500">${totalOwed.toFixed(2)}</div>
          <div className="mt-2 text-sm text-[var(--muted-foreground)]">Sum of all balances where others owe you.</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Balances</h1>
            <p className="text-sm text-[var(--muted-foreground)]">Manage your current outstanding balances and settle up quickly.</p>
          </div>
        </div>

        {isError ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
            Unable to load balances.
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
                <div className="h-4 w-1/3 rounded bg-slate-200" />
                <div className="mt-3 h-6 w-1/2 rounded bg-slate-200" />
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="h-4 w-full rounded bg-slate-200" />
                  <div className="h-4 w-full rounded bg-slate-200" />
                  <div className="h-4 w-full rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : (!balances || balances.length === 0) ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-center text-sm text-[var(--muted-foreground)]">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--secondary)]/20 text-[var(--foreground)]">
              <span>✅</span>
            </div>
            <div className="font-medium">All settled up! No outstanding balances.</div>
          </div>
        ) : (
          <div className="space-y-4">
            {balances.map((balance) => {
              const friend = friendMap.get(balance.friendId)
              const isPositive = balance.amount > 0
              const label = isPositive ? 'Owes you' : 'You owe'
              const amountClass = isPositive ? 'text-green-500' : 'text-red-500'

              return (
                <div
                  key={balance.id}
                  className="flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 transition hover:border-[var(--accent)]/50 hover:bg-[var(--secondary)]/10 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--secondary)] text-sm font-semibold text-[var(--foreground)]">
                      {friend?.name?.slice(0, 1) ?? balance.friendId.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--foreground)]">{friend?.name ?? balance.friendId}</div>
                      <div className="text-xs text-[var(--muted-foreground)]">{friend?.email ?? `${balance.friendId}@example.com`}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-1 sm:items-end">
                    <div className={`text-lg font-semibold ${amountClass}`}>${Math.abs(balance.amount).toFixed(2)}</div>
                    <div className="text-sm text-[var(--muted-foreground)]">{label}</div>
                  </div>
                  <div className="flex flex-col gap-3 sm:items-end">
                    <div className="text-sm text-[var(--muted-foreground)]">Updated {formatDate(balance.lastUpdated)}</div>
                    <button
                      type="button"
                      onClick={() => navigate(`/settlements?payee=${encodeURIComponent(balance.friendId)}`)}
                      className="rounded-md border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--secondary)]"
                    >
                      Settle Up
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
