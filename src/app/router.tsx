import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

// Layouts
const RootLayout = React.lazy(() => import('@/app/layouts/RootLayout'))
const AuthLayout = React.lazy(() => import('@/app/layouts/AuthLayout'))
const DashboardLayout = React.lazy(() => import('@/app/layouts/DashboardLayout'))

// Auth Pages
const LoginPage = React.lazy(() => import('@/features/auth/pages/LoginPage'))
const RegisterPage = React.lazy(() => import('@/features/auth/pages/RegisterPage'))

// Dashboard Pages
const DashboardPage = React.lazy(() => import('@/features/dashboard/pages/DashboardPage'))
const NotificationsPage = React.lazy(() => import('@/features/notifications/pages/NotificationsPage'))

// Expense Pages
const ExpensesPage = React.lazy(() => import('@/features/expenses/pages/ExpensesPage'))
const ExpenseDetailPage = React.lazy(() => import('@/features/expenses/pages/ExpenseDetailPage'))
const CreateExpensePage = React.lazy(() => import('@/features/expenses/pages/CreateExpensePage'))

// Friend Pages
const FriendsPage = React.lazy(() => import('@/features/friends/pages/FriendsPage'))

// Balance Pages
const BalancesPage = React.lazy(() => import('@/features/balances/pages/BalancesPage'))

// Settlement Pages
const SettlementsPage = React.lazy(() => import('@/features/settlements/pages/SettlementsPage'))

// Activity Pages
const ActivityPage = React.lazy(() => import('@/features/activity/pages/ActivityPage'))

// Settings Pages
const SettingsPage = React.lazy(() => import('@/features/settings/pages/SettingsPage'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      // Auth routes
      {
        path: 'login',
        element: <AuthLayout />,
        children: [
          {
            index: true,
            element: <LoginPage />,
          },
        ],
      },
      {
        path: 'register',
        element: <AuthLayout />,
        children: [
          {
            index: true,
            element: <RegisterPage />,
          },
        ],
      },

      // Protected routes
      {
        path: 'dashboard',
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
        ],
      },
      {
        path: 'notifications',
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <NotificationsPage />,
          },
        ],
      },
      {
        path: 'expenses',
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <ExpensesPage />,
          },
          {
            path: 'new',
            element: <CreateExpensePage />,
          },
          {
            path: ':id',
            element: <ExpenseDetailPage />,
          },
        ],
      },
      {
        path: 'friends',
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <FriendsPage />,
          },
        ],
      },
      {
        path: 'balances',
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <BalancesPage />,
          },
        ],
      },
      {
        path: 'settlements',
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <SettlementsPage />,
          },
        ],
      },
      {
        path: 'activity',
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <ActivityPage />,
          },
        ],
      },
      {
        path: 'settings',
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <SettingsPage />,
          },
        ],
      },
      {
        path: '*',
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },
])
