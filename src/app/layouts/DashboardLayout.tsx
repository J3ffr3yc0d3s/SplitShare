import { Navigate, Outlet } from 'react-router-dom'
import { Suspense, useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import Header from '@/components/shared/Header'
import Sidebar from '@/components/shared/Sidebar'
import MobileNav from '@/components/shared/MobileNav'

export default function DashboardLayout() {
  const { user, token } = useAuthStore()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  if (!hydrated) return null
  if (!user || !token) return <Navigate to="/login" replace />

  return (
    <div className="flex flex-col h-screen bg-background md:flex-row">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 border-r border-border">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-8">
            <Suspense fallback={<div>Loading...</div>}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  )
}
