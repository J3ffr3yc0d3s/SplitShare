import { beforeEach, describe, expect, it } from 'vitest'
import { useAuthStore } from './authStore'
import type { User } from '@/types'

describe('auth store', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: {
        id: '1',
        email: 'demo@example.com',
        name: 'Demo User',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      token: 'mock-token',
    })
  })

  it('has initial user and token', () => {
    const state = useAuthStore.getState()
    expect(state.user).not.toBeNull()
    expect(state.token).not.toBeNull()
  })

  it('logout() clears user and token to null', () => {
    const state = useAuthStore.getState()
    state.logout()
    expect(useAuthStore.getState().user).toBeNull()
    expect(useAuthStore.getState().token).toBeNull()
  })

  it('user object matches the User type shape', () => {
    const user = useAuthStore.getState().user as User
    expect(user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        email: expect.any(String),
        name: expect.any(String),
        createdAt: expect.any(Date),
      }),
    )
  })
})
