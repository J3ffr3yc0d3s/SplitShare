import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LoginPage from './LoginPage'

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

describe('LoginPage', () => {
  it('renders email input', () => {
    render(<LoginPage />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })

  it('renders password input', () => {
    render(<LoginPage />)
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('renders a submit/login button', () => {
    render(<LoginPage />)
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('typing into email input updates value', () => {
    render(<LoginPage />)
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    expect(emailInput.value).toBe('test@example.com')
  })

  it('typing into password input updates value', () => {
    render(<LoginPage />)
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement
    fireEvent.change(passwordInput, { target: { value: 'secret' } })
    expect(passwordInput.value).toBe('secret')
  })
})
