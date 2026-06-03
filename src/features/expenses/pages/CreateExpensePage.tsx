import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateExpense } from '@/hooks/useQueries'

const categories = [
  { value: 'food', label: 'Food' },
  { value: 'transport', label: 'Transport' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'other', label: 'Other' },
]

export default function CreateExpensePage() {
  const navigate = useNavigate()
  const createExpense = useCreateExpense()

  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [participants, setParticipants] = useState([{ userId: '', amount: 0 }])

  const handleAddParticipant = () => {
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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (!title || !amount || !category || !date) {
      return
    }

    const payload = {
      title,
      description,
      amount: Number(amount),
      category,
      date,
      paidBy: 'Me',
      participants: participants.filter((participant) => participant.userId.trim() !== ''),
    }

    try {
      await createExpense.mutateAsync(payload)
      navigate('/expenses')
    } catch {
      // error handled by mutation state or UI elsewhere
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

        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Participants</h2>
            <button
              type="button"
              onClick={handleAddParticipant}
              className="rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--secondary)]"
            >
              Add Participant
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {participants.map((participant, index) => (
              <div key={index} className="grid gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 md:grid-cols-[1.2fr_0.8fr_0.4fr]">
                <label className="flex flex-col gap-2 text-sm">
                  <span>User ID</span>
                  <input
                    value={participant.userId}
                    onChange={(event) => handleParticipantChange(index, 'userId', event.target.value)}
                    className="rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10"
                    placeholder="user-1"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm">
                  <span>Share Amount</span>
                  <input
                    type="number"
                    step="0.01"
                    value={participant.amount}
                    onChange={(event) => handleParticipantChange(index, 'amount', event.target.value)}
                    className="rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10"
                    placeholder="0.00"
                  />
                </label>
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
