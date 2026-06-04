import { useLocation, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import {
  LayoutDashboard,
  Receipt,
  Users,
  Scale,
  Repeat2,
  Activity,
  Settings,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/authStore'
import { queryKeys } from '@/lib/queryKeys'
import { dashboardService } from '@/services/api/dashboardService'
import { expenseService } from '@/services/api/expenseService'
import { balanceService } from '@/services/api/balanceService'

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Expenses', path: '/expenses', icon: Receipt },
  { label: 'Friends', path: '/friends', icon: Users },
  { label: 'Balances', path: '/balances', icon: Scale },
  { label: 'Settlements', path: '/settlements', icon: Repeat2 },
  { label: 'Activity', path: '/activity', icon: Activity },
  { label: 'Settings', path: '/settings', icon: Settings },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handlePrefetch = (path: string) => {
    switch (path) {
      case '/dashboard':
        return () =>
          queryClient.prefetchQuery({
            queryKey: queryKeys.dashboard.metrics(),
            queryFn: () => dashboardService.getDashboardMetrics().then((res) => res.data),
          })
      case '/expenses':
        return () =>
          queryClient.prefetchQuery({
            queryKey: queryKeys.expenses.lists(),
            queryFn: () => expenseService.getExpenses().then((res) => res.data),
          })
      case '/balances':
        return () =>
          queryClient.prefetchQuery({
            queryKey: queryKeys.balances.list(),
            queryFn: () => balanceService.getBalances().then((res) => res.data),
          })
      default:
        return undefined
    }
  }

  return (
    <aside className="w-[240px] min-h-full flex flex-col border-r border-[var(--border)] bg-[var(--sidebar)] px-4 py-6 text-[var(--foreground)]">
      <div className="mb-8">
        <p className="text-base font-medium">SplitShare</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
              onMouseEnter={handlePrefetch(item.path)}
              className={cn(
                'flex w-full items-center gap-3 rounded-none border-l-4 border-transparent px-3 py-2 text-sm transition-colors duration-150 ease-in-out',
                isActive
                  ? 'border-[var(--accent)] bg-[var(--card)] text-[var(--accent)]'
                  : 'text-[var(--foreground)] hover:bg-[var(--card)]'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="mt-6 border-t border-[var(--border)] pt-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--card)] text-sm font-semibold text-[var(--foreground)]">
            {user?.name?.charAt(0).toUpperCase() ?? 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--foreground)] truncate">{user?.name ?? 'Guest'}</p>
            <p className="text-xs text-[var(--muted)] truncate">{user?.email ?? 'Not signed in'}</p>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-4 w-full justify-start text-sm text-[var(--foreground)] hover:bg-[var(--card)]"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
