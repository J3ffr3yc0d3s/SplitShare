import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import RegisterPage from './RegisterPage'

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children }: any) => children,
}))

vi.mock('@/stores/authStore', () => ({
  useAuthStore: () => ({
    login: vi.fn(),
    setUser: vi.fn(),
    setToken: vi.fn(),
    user: null,
  }),
}))

describe('RegisterPage', () => {
  it('renders name input', () => {
    render(<RegisterPage />)
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
  })

  it('renders email input', () => {
    render(<RegisterPage />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })

  it('renders password input', () => {
    render(<RegisterPage />)
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
  })

  it('renders a register button', () => {
    render(<RegisterPage />)
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })
})
