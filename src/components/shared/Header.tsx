import { Bell, Moon, Sun } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const { theme, toggleTheme } = useUIStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--card)] backdrop-blur-md dark:bg-[var(--card)]">
      <div className="flex items-center justify-between h-12 px-4 md:px-6">
        <div className="text-sm font-medium text-[var(--foreground)]">Dashboard</div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-[var(--foreground)]"
            onClick={toggleTheme}
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-[var(--foreground)]"
            onClick={() => navigate('/notifications')}
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
          </Button>

          <div className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--card)] text-sm font-semibold text-[var(--foreground)]">
            {user?.name?.charAt(0).toUpperCase() ?? 'U'}
          </div>
        </div>
      </div>
    </header>
  )
}
