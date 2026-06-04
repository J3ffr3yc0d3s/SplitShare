import type { Friend } from '@/types'

/** User id to use when splitting expenses with an accepted friend. */
export function getAcceptedFriendUserId(friend: Friend): string {
  return friend.friendId
}

export function isAcceptedFriend(friend: Friend): boolean {
  return friend.status === 'accepted'
}

export function isIncomingRequest(friend: Friend, currentUserId: string): boolean {
  return friend.status === 'pending' && friend.friendId === currentUserId
}

export function isSentRequest(friend: Friend, currentUserId: string): boolean {
  return friend.status === 'pending' && friend.userId === currentUserId
}

/** One entry per accepted friend; excludes payer and duplicate API rows. */
export function dedupeAcceptedFriends(friends: Friend[], currentUserId: string): Friend[] {
  const seen = new Set<string>()
  const result: Friend[] = []

  for (const friend of friends) {
    if (!isAcceptedFriend(friend)) continue
    const friendUserId = getAcceptedFriendUserId(friend)
    if (friendUserId === currentUserId) continue
    if (seen.has(friendUserId)) continue
    seen.add(friendUserId)
    result.push(friend)
  }

  return result
}

export function partitionFriends(friends: Friend[], currentUserId: string) {
  const accepted: Friend[] = []
  const incoming: Friend[] = []
  const sent: Friend[] = []

  for (const friend of friends) {
    if (friend.status === 'rejected') continue
    if (isAcceptedFriend(friend)) {
      continue
    }
    if (isIncomingRequest(friend, currentUserId)) {
      incoming.push(friend)
      continue
    }
    if (isSentRequest(friend, currentUserId)) {
      sent.push(friend)
    }
  }

  return {
    accepted: dedupeAcceptedFriends(friends, currentUserId),
    incoming,
    sent,
  }
}

export function parseApiError(error: unknown): string {
  if (!(error instanceof Error)) return 'Something went wrong. Please try again.'

  try {
    const parsed = JSON.parse(error.message) as { message?: string | string[] }
    if (Array.isArray(parsed.message)) return parsed.message.join(', ')
    if (typeof parsed.message === 'string') return parsed.message
  } catch {
    // plain text error
  }

  return error.message || 'Something went wrong. Please try again.'
}
