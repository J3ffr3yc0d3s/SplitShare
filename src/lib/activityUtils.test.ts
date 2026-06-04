import { describe, expect, it } from 'vitest'
import {
  formatRelativeTime,
  getActivityDateGroup,
  getActivityIcon,
  getActivityPath,
  groupActivitiesByDate,
} from './activityUtils'
import type { Activity } from '@/types'

const baseActivity: Activity = {
  id: '1',
  userId: 'user-1',
  type: 'expense_added',
  description: 'Expense: Dinner',
  relatedId: 'exp-1',
  timestamp: new Date(),
}

describe('activityUtils', () => {
  it('maps activity types to icons', () => {
    expect(getActivityIcon('expense_added')).toBe('🧾')
    expect(getActivityIcon('expense_edited')).toBe('🧾')
    expect(getActivityIcon('settlement')).toBe('💸')
    expect(getActivityIcon('friend_added')).toBe('👤')
  })

  it('builds navigation paths by type', () => {
    expect(getActivityPath({ ...baseActivity, type: 'expense_added' })).toBe('/expenses/exp-1')
    expect(getActivityPath({ ...baseActivity, type: 'settlement' })).toBe('/settlements')
    expect(getActivityPath({ ...baseActivity, type: 'friend_added' })).toBe('/friends')
  })

  it('groups today, yesterday, and earlier', () => {
    const now = new Date('2026-06-05T15:00:00')
    const activities: Activity[] = [
      { ...baseActivity, id: 'a', timestamp: new Date('2026-06-05T10:00:00') },
      { ...baseActivity, id: 'b', timestamp: new Date('2026-06-04T10:00:00') },
      { ...baseActivity, id: 'c', timestamp: new Date('2026-06-01T10:00:00') },
    ]

    expect(getActivityDateGroup(activities[0].timestamp, now)).toBe('today')
    expect(getActivityDateGroup(activities[1].timestamp, now)).toBe('yesterday')

    const groups = groupActivitiesByDate(activities, now)
    expect(groups.map((g) => g.group)).toEqual(['today', 'yesterday', 'earlier'])
  })

  it('formats relative time for recent activity', () => {
    const now = new Date('2026-06-05T15:00:00')
    const twoHoursAgo = new Date('2026-06-05T13:00:00')
    expect(formatRelativeTime(twoHoursAgo, now)).toBe('2 hours ago')
  })
})
