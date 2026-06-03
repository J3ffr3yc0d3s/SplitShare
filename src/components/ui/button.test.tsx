import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Submit</Button>)
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', () => {
    const onClick = vi.fn()
    render(
      <Button onClick={onClick} disabled>
        Disabled
      </Button>,
    )
    fireEvent.click(screen.getByRole('button', { name: /disabled/i }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('applies outline variant class when variant="outline"', () => {
    render(<Button variant="outline">Outline</Button>)
    const button = screen.getByRole('button', { name: /outline/i })
    expect(button).toHaveClass('bg-transparent')
    expect(button).toHaveClass('border-[var(--border)]')
  })
})
