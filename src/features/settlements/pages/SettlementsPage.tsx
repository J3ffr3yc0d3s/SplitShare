import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useBalances, useFriends, useRecordSettlement, useSettlements } from '@/hooks/useQueries'
import { useAuthStore } from '@/stores/authStore'

const formatDate = (value: string | Date) =>
  new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

export default function SettlementsPage() {
  const [searchParams] = useSearchParams()
  const payeeFromUrl = searchParams.get('payee') ?? ''

  const currentUserId = useAuthStore((s) => s.user?.id)
  const { data: friends } = useFriends()
  const { data: balances } = useBalances()
  const { data: settlements, isLoading: settlementsLoading } = useSettlements()
  const recordSettlement = useRecordSettlement()

  const [payeeId, setPayeeId] = useState(payeeFromUrl)

  useEffect(() => {
    if (payeeFromUrl) {
      setPayeeId(payeeFromUrl)
    }
  }, [payeeFromUrl])
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const friendMap = useMemo(
    () => new Map((friends ?? []).map((friend) => [friend.friendId, friend])),
    [friends],
  )

  const balanceWithPayee = useMemo(
    () => balances?.find((balance) => balance.friendId === payeeId),
    [balances, payeeId],
  )

  const youOwePayee = balanceWithPayee && balanceWithPayee.amount < 0
    ? Math.abs(balanceWithPayee.amount)
    : 0

  const payeeOptions = useMemo(() => {
    const owingFriends =
      balances
        ?.filter((balance) => balance.amount < 0)
        .map((balance) => balance.friendId) ?? []

    const ids = new Set(owingFriends)
    if (payeeFromUrl) {
      ids.add(payeeFromUrl)
    }

    return Array.from(ids)
  }, [balances, payeeFromUrl])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setFormError(null)

    const parsedAmount = Number.parseFloat(amount)
    if (!payeeId) {
      setFormError('Select who you are paying.')
      return
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setFormError('Enter a valid amount greater than 0.')
      return
    }
    if (youOwePayee > 0 && parsedAmount > youOwePayee + 0.001) {
      setFormError(`You only owe $${youOwePayee.toFixed(2)} to this friend.`)
      return
    }

    try {
      await recordSettlement.mutateAsync({
        to: payeeId,
        amount: parsedAmount,
        note: note.trim() || undefined,
      })
      setAmount('')
      setNote('')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to record settlement.'
      setFormError(message)
    }
  }

  const settleFull = () => {
    if (youOwePayee > 0) {
      setAmount(youOwePayee.toFixed(2))
    }
  }

  return (
    <div className="space-y-8 py-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Settlements</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Record a payment to reduce what you owe. Partial payments apply to oldest expenses first.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6"
      >
        <h2 className="text-lg font-medium">Record payment</h2>

        <label className="block space-y-1 text-sm">
          <span className="text-[var(--muted-foreground)]">Pay to</span>
          <select
            value={payeeId}
            onChange={(event) => setPayeeId(event.target.value)}
            className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2"
          >
            <option value="">Select friend</option>
            {payeeOptions.map((friendId) => {
              const friend = friendMap.get(friendId)
              const label = friend?.name ?? friendId.slice(0, 8)
              return (
                <option key={friendId} value={friendId}>
                  {label}
                </option>
              )
            })}
          </select>
        </label>

        {payeeId && youOwePayee > 0 && (
          <p className="text-sm text-[var(--muted-foreground)]">
            Outstanding to this friend:{' '}
            <span className="font-medium text-[var(--foreground)]">${youOwePayee.toFixed(2)}</span>
            <button
              type="button"
              onClick={settleFull}
              className="ml-2 text-sm font-medium text-[var(--primary)] hover:underline"
            >
              Settle full amount
            </button>
          </p>
        )}

        <label className="block space-y-1 text-sm">
          <span className="text-[var(--muted-foreground)]">Amount</span>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2"
            placeholder="0.00"
          />
        </label>

        <label className="block space-y-1 text-sm">
          <span className="text-[var(--muted-foreground)]">Note (optional)</span>
          <input
            type="text"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2"
            placeholder="e.g. Venmo"
          />
        </label>

        {formError && <p className="text-sm text-red-500">{formError}</p>}

        <button
          type="submit"
          disabled={recordSettlement.isPending}
          className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] disabled:opacity-60"
        >
          {recordSettlement.isPending ? 'Recording…' : 'Record settlement'}
        </button>
      </form>

      <div className="space-y-4">
        <h2 className="text-lg font-medium">History</h2>
        {settlementsLoading ? (
          <p className="text-sm text-[var(--muted-foreground)]">Loading settlements…</p>
        ) : !settlements?.length ? (
          <p className="text-sm text-[var(--muted-foreground)]">No settlements yet.</p>
        ) : (
          <div className="space-y-3">
            {settlements.map((settlement) => {
              const youPaid = settlement.from === currentUserId
              const counterpartyId = youPaid ? settlement.to : settlement.from
              const counterparty = friendMap.get(counterpartyId)
              const counterpartyLabel = counterparty?.name ?? counterpartyId.slice(0, 8)
              const directionLabel = youPaid
                ? `Paid ${counterpartyLabel}`
                : `Received from ${counterpartyLabel}`

              return (
                <div
                  key={settlement.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"
                >
                  <div>
                    <div className="font-medium">{directionLabel}</div>
                    <div className="text-sm text-[var(--muted-foreground)]">
                      {formatDate(settlement.createdAt)} · {settlement.status}
                    </div>
                  </div>
                  <div className="text-lg font-semibold">${settlement.amount.toFixed(2)}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
