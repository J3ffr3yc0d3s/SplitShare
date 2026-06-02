import { useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Receipt,
  Users,
  Scale,
  Repeat2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Expenses', path: '/expenses', icon: Receipt },
  { label: 'Friends', path: '/friends', icon: Users },
  { label: 'Balances', path: '/balances', icon: Scale },
  { label: 'Settlements', path: '/settlements', icon: Repeat2 },
]

export default function MobileNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 md:hidden border-t border-[var(--border)] bg-[var(--background)]">
      <div className="flex items-center justify-around h-14 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 rounded-none px-2 py-2 text-[var(--muted)] transition-colors duration-150 ease-in-out',
                isActive && 'text-[var(--accent)]'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
