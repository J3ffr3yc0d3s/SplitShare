export default function NotificationsPage() {
  return (
    <div className="space-y-8 py-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <p className="text-sm text-[var(--muted-foreground)]">Stay up to date with the latest alerts and reminders.</p>
      </div>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-center text-sm text-[var(--muted-foreground)]">
        No notifications yet.
      </div>
    </div>
  )
}
