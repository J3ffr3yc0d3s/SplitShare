import type { Activity } from '@/types'

export type ActivityDateGroup = 'today' | 'yesterday' | 'earlier'

const ACTIVITY_GROUP_LABELS: Record<ActivityDateGroup, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  earlier: 'Earlier',
}

const ACTIVITY_GROUP_ORDER: ActivityDateGroup[] = ['today', 'yesterday', 'earlier']

/** Icon per activity type; extend when backend adds new types. */
export function getActivityIcon(type: Activity['type']): string {
  switch (type) {
    case 'expense_added':
    case 'expense_edited':
    case 'expense_deleted':
      return '🧾'
    case 'settlement':
      return '💸'
    case 'friend_added':
      return '👤'
    default:
      return '•'
  }
}

export function getActivityPath(activity: Activity): string | null {
  switch (activity.type) {
    case 'expense_added':
    case 'expense_edited':
    case 'expense_deleted':
      return activity.relatedId ? `/expenses/${activity.relatedId}` : null
    case 'settlement':
      return '/settlements'
    case 'friend_added':
      return '/friends'
    default:
      return null
  }
}

export function getActivityDateGroup(date: Date, now = new Date()): ActivityDateGroup {
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfActivityDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const dayDiff = Math.round(
    (startOfToday.getTime() - startOfActivityDay.getTime()) / 86_400_000,
  )

  if (dayDiff === 0) {
    return 'today'
  }
  if (dayDiff === 1) {
    return 'yesterday'
  }
  return 'earlier'
}

export function formatRelativeTime(date: Date, now = new Date()): string {
  const diffMs = Math.max(0, now.getTime() - date.getTime())
  const diffSec = Math.floor(diffMs / 1000)

  if (diffSec < 45) {
    return 'Just now'
  }

  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) {
    return diffMin === 1 ? '1 minute ago' : `${diffMin} minutes ago`
  }

  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24 && getActivityDateGroup(date, now) === 'today') {
    return diffHr === 1 ? '1 hour ago' : `${diffHr} hours ago`
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

export function groupActivitiesByDate(
  activities: Activity[],
  now = new Date(),
): { group: ActivityDateGroup; label: string; items: Activity[] }[] {
  const buckets: Record<ActivityDateGroup, Activity[]> = {
    today: [],
    yesterday: [],
    earlier: [],
  }

  for (const activity of activities) {
    buckets[getActivityDateGroup(activity.timestamp, now)].push(activity)
  }

  return ACTIVITY_GROUP_ORDER.filter((group) => buckets[group].length > 0).map((group) => ({
    group,
    label: ACTIVITY_GROUP_LABELS[group],
    items: buckets[group],
  }))
}
