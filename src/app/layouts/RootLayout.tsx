import { Outlet } from 'react-router-dom'
import { Suspense, useEffect } from 'react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { useUIStore } from '@/stores/uiStore'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
})

export default function RootLayout() {
  const { theme } = useUIStore()

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
  }, [theme])

  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (stored) useUIStore.getState().setTheme(stored)
    else document.documentElement.classList.add('dark')
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen bg-background">
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center bg-background">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--muted)] border-t-[var(--accent)]" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
        <Toaster position="bottom-right" />
      </div>
    </QueryClientProvider>
  )
}
