import { FormEvent, useMemo, useState } from 'react'
import { useFriends, useSendFriendRequest, useUpdateFriendRequest } from '@/hooks/useQueries'
import { useAuthStore } from '@/stores/authStore'
import { partitionFriends, parseApiError } from '@/lib/friendUtils'
import type { Friend } from '@/types'

function FriendAvatar({ name }: { name: string }) {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--secondary)] text-sm font-semibold text-[var(--foreground)]">
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

function FriendCard({
  name,
  email,
  meta,
  actions,
}: {
  name: string
  email: string
  meta?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4 min-w-0">
        <FriendAvatar name={name} />
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-[var(--foreground)]">{name}</div>
          <div className="truncate text-xs text-[var(--muted-foreground)]">{email}</div>
          {meta ? <div className="mt-1 text-xs text-[var(--muted-foreground)]">{meta}</div> : null}
        </div>
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  )
}

function Section({
  title,
  description,
  children,
  emptyMessage,
  isEmpty,
}: {
  title: string
  description?: string
  children: React.ReactNode
  emptyMessage?: string
  isEmpty?: boolean
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {description ? <p className="mt-1 text-sm text-[var(--muted-foreground)]">{description}</p> : null}
      </div>
      {isEmpty && emptyMessage ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 text-center text-sm text-[var(--muted-foreground)]">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-3">{children}</div>
      )}
    </section>
  )
}

function LoadingCards({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-full bg-slate-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 rounded bg-slate-200" />
              <div className="h-3 w-1/2 rounded bg-slate-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function FriendsPage() {
  const { user } = useAuthStore()
  const currentUserId = user?.id ?? ''
  const { data: friends, isLoading, isError, error, refetch } = useFriends()
  const sendRequest = useSendFriendRequest()
  const updateRequest = useUpdateFriendRequest()

  const [email, setEmail] = useState('')
  const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const { accepted, incoming, sent } = useMemo(
    () => partitionFriends(friends ?? [], currentUserId),
    [friends, currentUserId],
  )

  const handleAddFriend = async (event: FormEvent) => {
    event.preventDefault()
    setFormMessage(null)

    const trimmed = email.trim()
    if (!trimmed) {
      setFormMessage({ type: 'error', text: 'Enter an email address.' })
      return
    }

    try {
      await sendRequest.mutateAsync(trimmed)
      setEmail('')
      setFormMessage({ type: 'success', text: `Friend request sent to ${trimmed}.` })
    } catch (err) {
      setFormMessage({ type: 'error', text: parseApiError(err) })
    }
  }

  const handleUpdateRequest = async (id: string, status: 'accepted' | 'rejected') => {
    setActionError(null)
    try {
      await updateRequest.mutateAsync({ id, status })
    } catch (err) {
      setActionError(parseApiError(err))
    }
  }

  const renderRequestActions = (request: Friend, type: 'incoming' | 'sent') => {
    if (type === 'sent') {
      return (
        <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium text-[var(--muted-foreground)]">
          Pending
        </span>
      )
    }

    return (
      <>
        <button
          type="button"
          onClick={() => handleUpdateRequest(request.id, 'accepted')}
          disabled={updateRequest.isPending}
          className="rounded-md bg-[var(--accent)] px-3 py-2 text-sm font-medium text-[var(--accent-foreground)] hover:bg-[rgba(37,99,235,0.92)] disabled:opacity-60"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => handleUpdateRequest(request.id, 'rejected')}
          disabled={updateRequest.isPending}
          className="rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--secondary)] disabled:opacity-60"
        >
          Decline
        </button>
      </>
    )
  }

  return (
    <div className="space-y-8 py-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Friends</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Add friends, manage requests, and split expenses together.
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="text-lg font-semibold">Add Friend</h2>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Send a request using the email address they registered with.
        </p>
        <form onSubmit={handleAddFriend} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start">
          <label className="flex flex-1 flex-col gap-2 text-sm">
            <span className="sr-only">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="friend@example.com"
              className="rounded-md border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10"
            />
          </label>
          <button
            type="submit"
            disabled={sendRequest.isPending}
            className="rounded-md bg-[var(--accent)] px-5 py-2 text-sm font-medium text-[var(--accent-foreground)] hover:bg-[rgba(37,99,235,0.92)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sendRequest.isPending ? 'Sending...' : 'Send Request'}
          </button>
        </form>
        {formMessage ? (
          <p
            className={`mt-3 text-sm ${
              formMessage.type === 'success' ? 'text-green-600' : 'text-destructive'
            }`}
          >
            {formMessage.text}
          </p>
        ) : null}
      </div>

      {actionError ? (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
          {actionError}
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
          <p>Unable to load friends.</p>
          <p className="mt-1 text-xs opacity-80">{error instanceof Error ? error.message : 'Unknown error'}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-sm font-medium hover:bg-[var(--secondary)]"
          >
            Retry
          </button>
        </div>
      ) : isLoading ? (
        <LoadingCards count={4} />
      ) : (
        <>
          <Section
            title="Friends"
            description="Accepted friends you can add to expenses."
            isEmpty={accepted.length === 0}
            emptyMessage="No friends yet. Send a request above to get started."
          >
            {accepted.map((friend) => (
              <FriendCard key={friend.id} name={friend.name} email={friend.email} meta="Accepted" />
            ))}
          </Section>

          <Section
            title="Incoming Requests"
            description="Requests from others waiting for your response."
            isEmpty={incoming.length === 0}
            emptyMessage="No incoming friend requests."
          >
            {incoming.map((request) => (
              <FriendCard
                key={request.id}
                name={request.name}
                email={request.email}
                meta="Wants to connect with you"
                actions={renderRequestActions(request, 'incoming')}
              />
            ))}
          </Section>

          <Section
            title="Sent Requests"
            description="Requests you have sent that are still pending."
            isEmpty={sent.length === 0}
            emptyMessage="No pending sent requests."
          >
            {sent.map((request) => (
              <FriendCard
                key={request.id}
                name={request.name}
                email={request.email}
                meta="Waiting for them to accept"
                actions={renderRequestActions(request, 'sent')}
              />
            ))}
          </Section>
        </>
      )}
    </div>
  )
}
