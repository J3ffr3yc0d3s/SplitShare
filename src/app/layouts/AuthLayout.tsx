import { Outlet } from 'react-router-dom'
import { Suspense } from 'react'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <Suspense
          fallback={
            <div className="flex min-h-[60vh] items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--muted)] border-t-[var(--accent)]" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </div>
    </div>
  )
}
