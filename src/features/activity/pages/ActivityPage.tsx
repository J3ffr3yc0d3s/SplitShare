import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useActivity } from '@/hooks/useQueries'
import {
  formatRelativeTime,
  getActivityIcon,
  getActivityPath,
  groupActivitiesByDate,
} from '@/lib/activityUtils'

function ActivitySkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"
        >
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 max-w-xs rounded bg-slate-200" />
              <div className="h-3 w-24 rounded bg-slate-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

type ActivityRowProps = {
  description: string
  icon: string
  relativeTime: string
  to: string | null
}

function ActivityRow({ description, icon, relativeTime, to }: ActivityRowProps) {
  const content = (
    <div className="flex items-start gap-3">
      <span className="text-xl leading-none" aria-hidden>
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-[var(--foreground)]">{description}</p>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">{relativeTime}</p>
      </div>
    </div>
  )

  if (!to) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">{content}</div>
    )
  }

  return (
    <Link
      to={to}
      className="block rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 transition-colors hover:bg-[var(--secondary)]"
    >
      {content}
    </Link>
  )
}

export default function ActivityPage() {
  const navigate = useNavigate()
  const { data, isLoading, isError, refetch, isFetching } = useActivity()

  const activities = data ?? []

  const grouped = useMemo(
    () => groupActivitiesByDate(activities),
    [activities],
  )

  return (
    <div className="space-y-8 py-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Activity</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          See recent activity across your expenses, friends, and settlements.
        </p>
      </div>

      {isLoading ? (
        <ActivitySkeleton />
      ) : isError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
          <p className="text-sm text-destructive">Unable to load activity.</p>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="mt-4 rounded-md border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm font-medium hover:bg-[var(--secondary)] disabled:opacity-60"
          >
            {isFetching ? 'Retrying…' : 'Retry'}
          </button>
        </div>
      ) : activities.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
          <p className="text-sm text-[var(--muted-foreground)]">No activity yet</p>
          <button
            type="button"
            onClick={() => navigate('/expenses/new')}
            className="mt-4 rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)]"
          >
            Add expense
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map((section) => (
            <section key={section.group} className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                {section.label}
              </h2>
              <div className="space-y-3">
                {section.items.map((activity) => (
                  <ActivityRow
                    key={`${activity.type}-${activity.id}`}
                    description={activity.description}
                    icon={getActivityIcon(activity.type)}
                    relativeTime={formatRelativeTime(activity.timestamp)}
                    to={getActivityPath(activity)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
