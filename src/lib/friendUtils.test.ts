import { describe, expect, it } from 'vitest'
import {
  partitionFriends,
  isAcceptedFriend,
  isIncomingRequest,
  isSentRequest,
  dedupeAcceptedFriends,
} from './friendUtils'
import type { Friend } from '@/types'

const me = 'user-a'
const them = 'user-b'

const accepted: Friend = {
  id: 'f1',
  userId: me,
  friendId: them,
  email: 'b@test.com',
  name: 'B',
  addedAt: new Date(),
  status: 'accepted',
}

const incoming: Friend = {
  id: 'r1',
  userId: them,
  friendId: me,
  email: 'b@test.com',
  name: 'B',
  addedAt: new Date(),
  status: 'pending',
}

const sent: Friend = {
  id: 'r2',
  userId: me,
  friendId: them,
  email: 'b@test.com',
  name: 'B',
  addedAt: new Date(),
  status: 'pending',
}

describe('friendUtils', () => {
  it('partitions accepted, incoming, and sent requests', () => {
    const result = partitionFriends([accepted, incoming, sent], me)
    expect(result.accepted).toHaveLength(1)
    expect(result.incoming).toHaveLength(1)
    expect(result.sent).toHaveLength(1)
  })

  it('classifies request direction', () => {
    expect(isAcceptedFriend(accepted)).toBe(true)
    expect(isIncomingRequest(incoming, me)).toBe(true)
    expect(isSentRequest(sent, me)).toBe(true)
  })

  it('dedupes duplicate accepted friends and excludes payer', () => {
    const duplicateAccepted: Friend = { ...accepted, id: 'f2' }
    const selfEntry: Friend = { ...accepted, id: 'self', friendId: me }
    const result = dedupeAcceptedFriends([accepted, duplicateAccepted, selfEntry], me)
    expect(result).toHaveLength(1)
    expect(result[0].friendId).toBe(them)
  })
})
