import { FormEvent, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { dedupeAcceptedFriends, getAcceptedFriendUserId, isAcceptedFriend } from '@/lib/friendUtils'
import { useAuthStore } from '@/stores/authStore'
import {
  splitEqualFriendShares,
  equalSplitTotalsMatch,
  roundMoney,
  sumsToTotal,
} from '@/lib/splitUtils'
import { useCreateExpense, useFriends } from '@/hooks/useQueries'
import type { Friend } from '@/types'

const categories = [
  { value: 'food', label: 'Food' },
  { value: 'transport', label: 'Transport' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'other', label: 'Other' },
]

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

type SplitType = 'equal' | 'custom'
type ParticipantRow = { userId: string; amount: number }

function isValidParticipantUuid(userId: string) {
  return UUID_REGEX.test(userId.trim())
}

function getFriendLabel(friends: Friend[] | undefined, userId: string) {
  const friend = friends?.find((f) => isAcceptedFriend(f) && getAcceptedFriendUserId(f) === userId)
  return friend ? `${friend.name} (${friend.email})` : userId
}

function dedupeParticipantRows(rows: ParticipantRow[]): { rows: ParticipantRow[]; error: string | null } {
  const seen = new Set<string>()
  const deduped: ParticipantRow[] = []

  for (const row of rows) {
    const userId = row.userId.trim()
    if (seen.has(userId)) {
      return { rows: [], error: 'Each friend can only be added once to this expense.' }
    }
    seen.add(userId)
    deduped.push({ ...row, userId })
  }

  return { rows: deduped, error: null }
}

export default function CreateExpensePage() {
  const navigate = useNavigate()
  const createExpense = useCreateExpense()
  const { user } = useAuthStore()
  const currentUserId = user?.id ?? ''
  const { data: friends, isLoading: friendsLoading } = useFriends()

  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [splitType, setSplitType] = useState<SplitType>('equal')
  const [participants, setParticipants] = useState<ParticipantRow[]>([])
  const [submitError, setSubmitError] = useState<string | null>(null)

  const expenseAmount = Number(amount)
  const hasValidExpenseAmount = Number.isFinite(expenseAmount) && expenseAmount > 0

  const acceptedFriends = useMemo(
    () => dedupeAcceptedFriends(friends ?? [], currentUserId),
    [friends, currentUserId],
  )

  const selectedFriendIds = useMemo(
    () => new Set(participants.map((p) => p.userId).filter(Boolean)),
    [participants],
  )

  const friendsAvailableToAdd = acceptedFriends.filter(
    (f) => !selectedFriendIds.has(getAcceptedFriendUserId(f)),
  )

  const selectedParticipants = useMemo(
    () => participants.filter((p) => p.userId.trim() !== ''),
    [participants],
  )

  const equalShares = useMemo(() => {
    if (!hasValidExpenseAmount || selectedParticipants.length === 0) return []
    return splitEqualFriendShares(expenseAmount, selectedParticipants.length)
  }, [expenseAmount, hasValidExpenseAmount, selectedParticipants.length])

  const payerImplicitShare = useMemo(() => {
    if (!hasValidExpenseAmount || equalShares.length === 0) return 0
    const friendTotal = roundMoney(equalShares.reduce((sum, share) => sum + share, 0))
    return roundMoney(expenseAmount - friendTotal)
  }, [equalShares, expenseAmount, hasValidExpenseAmount])

  const equalSplitPreview = useMemo(
    () =>
      selectedParticipants.map((participant, index) => ({
        userId: participant.userId,
        label: getFriendLabel(friends, participant.userId),
        amount: equalShares[index] ?? 0,
      })),
    [selectedParticipants, equalShares, friends],
  )

  const customShareTotal = useMemo(
    () =>
      roundMoney(
        selectedParticipants.reduce((sum, participant) => sum + (participant.amount || 0), 0),
      ),
    [selectedParticipants],
  )

  const getFriendsForRow = (rowIndex: number) => {
    const currentId = participants[rowIndex]?.userId
    return acceptedFriends.filter((friend) => {
      const id = getAcceptedFriendUserId(friend)
      return id === currentId || !selectedFriendIds.has(id)
    })
  }

  const handleAddParticipant = () => {
    if (friendsAvailableToAdd.length === 0) return
    setParticipants((current) => [...current, { userId: '', amount: 0 }])
  }

  const handleParticipantChange = (index: number, field: 'userId' | 'amount', value: string) => {
    setParticipants((current) =>
      current.map((participant, idx) =>
        idx !== index
          ? participant
          : {
              ...participant,
              [field]: field === 'amount' ? Number(value) : value,
            },
      ),
    )
  }

  const handleRemoveParticipant = (index: number) => {
    setParticipants((current) => current.filter((_, idx) => idx !== index))
  }

  const validateParticipantIds = (rows: ParticipantRow[]) => {
    for (const participant of rows) {
      const userId = participant.userId.trim()
      if (!isValidParticipantUuid(userId)) {
        return 'Each participant must be a friend selected from the list.'
      }
      if (!acceptedFriends.some((friend) => getAcceptedFriendUserId(friend) === userId)) {
        return 'Participants must be your accepted friends.'
      }
    }
    return null
  }

  const buildValidParticipants = (): { error: string | null; valid: ParticipantRow[] } => {
    const { rows: dedupedRows, error: dedupeError } = dedupeParticipantRows(selectedParticipants)
    if (dedupeError) return { error: dedupeError, valid: [] }

    const rows = dedupedRows

    const idError = validateParticipantIds(rows)
    if (idError) return { error: idError, valid: [] }

    if (rows.some((row) => row.userId.trim() === currentUserId)) {
      return { error: 'You cannot add yourself as a participant. Your share is calculated automatically.', valid: [] }
    }

    if (rows.length === 0) {
      return { error: null, valid: [] }
    }

    if (!hasValidExpenseAmount) {
      return { error: 'Enter a valid expense amount greater than 0 to split with participants.', valid: [] }
    }

    if (splitType === 'equal') {
      const shares = splitEqualFriendShares(expenseAmount, rows.length)
      if (!equalSplitTotalsMatch(expenseAmount, shares)) {
        return { error: 'Could not calculate equal shares. Please try again.', valid: [] }
      }

      return {
        error: null,
        valid: rows.map((row, index) => ({
          userId: row.userId.trim(),
          amount: shares[index],
        })),
      }
    }

    const shares = rows.map((row) => roundMoney(row.amount))
    if (shares.some((share) => !Number.isFinite(share) || share <= 0)) {
      return { error: 'Each participant share must be greater than 0.', valid: [] }
    }

    if (!sumsToTotal(shares, expenseAmount)) {
      return {
        error: `Participant shares must add up to $${expenseAmount.toFixed(2)} (currently $${roundMoney(shares.reduce((a, b) => a + b, 0)).toFixed(2)}).`,
        valid: [],
      }
    }

    return {
      error: null,
      valid: rows.map((row, index) => ({
        userId: row.userId.trim(),
        amount: shares[index],
      })),
    }
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitError(null)

    if (!title || !amount || !category || !date) {
      setSubmitError('Please fill in title, amount, category, and date.')
      return
    }

    if (!hasValidExpenseAmount) {
      setSubmitError('Enter a valid expense amount greater than 0.')
      return
    }

    const { error, valid } = buildValidParticipants()
    if (error) {
      setSubmitError(error)
      return
    }

    const payload = {
      title,
      description,
      amount: expenseAmount,
      category,
      expenseDate: date,
      splitType,
      participants: valid,
    }

    try {
      await createExpense.mutateAsync(payload as never)
      navigate('/expenses')
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to create expense.')
    }
  }

  return (
    <div className="space-y-8 py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Add Expense</h1>
          <p className="text-sm text-[var(--muted-foreground)]">Create a new expense record and share it with participants.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/expenses')}
          className="rounded-md border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--secondary)]"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {submitError ? (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
            {submitError}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm">
            <span>Title</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="rounded-md border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10"
              placeholder="Dinner with friends"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span>Amount</span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="rounded-md border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10"
              placeholder="0.00"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span>Category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-md border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10"
            >
              {categories.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span>Date</span>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="rounded-md border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10"
            />
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm">
          <span>Description</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            className="min-h-[120px] rounded-md border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10"
            placeholder="Add a note or details about the expense (optional)"
          />
        </label>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Split Type</h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Choose how participant shares are calculated.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {(['equal', 'custom'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSplitType(type)}
                className={`rounded-md border px-4 py-2 text-sm font-medium transition ${
                  splitType === type
                    ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)]'
                    : 'border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--secondary)]'
                }`}
              >
                {type === 'equal' ? 'Equal' : 'Custom'}
              </button>
            ))}
          </div>
          <p className="text-sm text-[var(--muted-foreground)]">
            {splitType === 'equal'
              ? 'The expense is divided evenly among you and each selected friend. Friend rows store only what each friend owes you.'
              : 'Enter each participant share manually. Shares must add up to the full expense amount.'}
          </p>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Participants</h2>
            <button
              type="button"
              onClick={handleAddParticipant}
              disabled={friendsLoading || friendsAvailableToAdd.length === 0}
              className="rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--secondary)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add Participant
            </button>
          </div>

          {friendsLoading ? (
            <p className="mt-4 text-sm text-[var(--muted-foreground)]">Loading friends...</p>
          ) : acceptedFriends.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--muted-foreground)]">
              You have no friends yet. You can save this expense without participants, or{' '}
              <Link to="/friends" className="font-medium text-[var(--accent)] hover:underline">
                add friends
              </Link>{' '}
              first to split costs.
            </p>
          ) : (
            <p className="mt-4 text-sm text-[var(--muted-foreground)]">
              {splitType === 'equal'
                ? 'Select friends to split with. The total is divided by you plus each friend.'
                : 'Select friends and enter custom share amounts that total the expense amount.'}
            </p>
          )}

          {splitType === 'equal' && equalSplitPreview.length > 0 && hasValidExpenseAmount ? (
            <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
              <div className="text-sm font-medium text-[var(--foreground)]">Equal split preview</div>
              <ul className="mt-3 space-y-2">
                {equalSplitPreview.map((row) => (
                  <li
                    key={row.userId}
                    className="flex items-center justify-between text-sm text-[var(--muted-foreground)]"
                  >
                    <span className="truncate pr-4">{row.label}</span>
                    <span className="font-semibold text-[var(--foreground)]">${row.amount.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 space-y-1 border-t border-[var(--border)] pt-3 text-sm">
                <div className="flex justify-between text-[var(--muted-foreground)]">
                  <span>Your share (not billed to friends)</span>
                  <span>${payerImplicitShare.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total owed to you</span>
                  <span className="text-[var(--accent)]">
                    ${roundMoney(equalSplitPreview.reduce((sum, row) => sum + row.amount, 0)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ) : null}

          {splitType === 'custom' && selectedParticipants.length > 0 && hasValidExpenseAmount ? (
            <div className="mt-4 text-sm text-[var(--muted-foreground)]">
              Share total:{' '}
              <span
                className={
                  sumsToTotal(
                    selectedParticipants.map((p) => p.amount),
                    expenseAmount,
                  )
                    ? 'font-semibold text-green-600'
                    : 'font-semibold text-destructive'
                }
              >
                ${customShareTotal.toFixed(2)}
              </span>{' '}
              / ${expenseAmount.toFixed(2)}
            </div>
          ) : null}

          <div className="mt-4 space-y-4">
            {participants.map((participant, index) => (
              <div
                key={index}
                className={`grid gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 ${
                  splitType === 'equal' ? 'md:grid-cols-[1fr_auto]' : 'md:grid-cols-[1.2fr_0.8fr_0.4fr]'
                }`}
              >
                <label className="flex flex-col gap-2 text-sm">
                  <span>Friend</span>
                  <select
                    value={participant.userId}
                    onChange={(event) => handleParticipantChange(index, 'userId', event.target.value)}
                    className="rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10"
                  >
                    <option value="">Select a friend</option>
                    {getFriendsForRow(index).map((friend) => (
                      <option key={friend.id} value={getAcceptedFriendUserId(friend)}>
                        {friend.name} ({friend.email})
                      </option>
                    ))}
                  </select>
                </label>
                {splitType === 'custom' ? (
                  <label className="flex flex-col gap-2 text-sm">
                    <span>Share Amount</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={participant.amount || ''}
                      onChange={(event) => handleParticipantChange(index, 'amount', event.target.value)}
                      className="rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10"
                      placeholder="0.00"
                    />
                  </label>
                ) : null}
                <button
                  type="button"
                  onClick={() => handleRemoveParticipant(index)}
                  className="self-end rounded-md border border-destructive bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/20"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate('/expenses')}
            className="rounded-md border border-[var(--border)] bg-[var(--background)] px-5 py-3 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--secondary)]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createExpense.isLoading}
            className="rounded-md bg-[var(--accent)] px-5 py-3 text-sm font-medium text-[var(--accent-foreground)] hover:bg-[rgba(37,99,235,0.92)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createExpense.isLoading ? 'Saving...' : 'Save Expense'}
          </button>
        </div>
      </form>
    </div>
  )
}
