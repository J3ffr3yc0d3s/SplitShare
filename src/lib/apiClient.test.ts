import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient, toApiResponse } from './apiClient'
import { useAuthStore } from '@/stores/authStore'

const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

describe('toApiResponse', () => {
  it('wraps raw NestJS JSON bodies in { data }', () => {
    const metrics = { totalExpenses: 10, totalOwed: 5, totalOwing: 2 }
    expect(toApiResponse(metrics)).toEqual({ data: metrics })
  })

  it('passes through existing ApiResponse envelopes', () => {
    const wrapped = { data: [{ id: '1' }], meta: { page: 1 } }
    expect(toApiResponse(wrapped)).toEqual(wrapped)
  })

  it('does not treat auth responses as ApiResponse', () => {
    const auth = { accessToken: 'token', user: { id: '1' } }
    expect(toApiResponse(auth)).toEqual({ data: auth })
  })
})

describe('apiClient', () => {
  let fetchMock: ReturnType<typeof vi.fn>
  let localStorageMock: { getItem: ReturnType<typeof vi.fn>; setItem: ReturnType<typeof vi.fn>; removeItem: ReturnType<typeof vi.fn>; clear: ReturnType<typeof vi.fn> }

  beforeEach(() => {
    fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    }
    vi.stubGlobal('localStorage', localStorageMock)
    useAuthStore.getState().setToken(null)
  })

  it('sends correct Content-Type header', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ success: true }),
    })

    await apiClient('/test', { method: 'POST', headers: { 'X-Test': '1' }, body: JSON.stringify({}) })

    expect(fetchMock).toHaveBeenCalledWith(
      `${baseUrl}/api/test`,
      expect.objectContaining({
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      }),
    )
  })

  it('throws on non-OK response', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: vi.fn(),
    })

    await expect(apiClient('/unauthorized')).rejects.toThrow('API error 401')
  })

  it('reads auth-token from localStorage and sends Authorization header', async () => {
    localStorageMock.getItem.mockImplementation((key) => (key === 'auth-token' ? 'token-123' : null))
    fetchMock.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ success: true }),
    })

    await apiClient('/auth-test')

    expect(fetchMock).toHaveBeenCalledWith(
      `${baseUrl}/api/auth-test`,
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer token-123' }),
      }),
    )
  })

  it('falls back to token stored in the persisted auth-store value', async () => {
    localStorageMock.getItem.mockImplementation((key) =>
      key === 'auth-token'
        ? null
        : key === 'auth-store'
        ? JSON.stringify({ state: { token: 'persisted-token' } })
        : null,
    )
    fetchMock.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ success: true }),
    })

    await apiClient('/auth-fallback')

    expect(fetchMock).toHaveBeenCalledWith(
      `${baseUrl}/api/auth-fallback`,
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer persisted-token' }),
      }),
    )
  })

  it('does not send Authorization for blank stored tokens', async () => {
    localStorageMock.getItem.mockImplementation((key) =>
      key === 'auth-store'
        ? JSON.stringify({ state: { token: '   ' } })
        : null,
    )
    fetchMock.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ success: true }),
    })

    await apiClient('/blank-token')

    expect(fetchMock).toHaveBeenCalledWith(
      `${baseUrl}/api/blank-token`,
      expect.objectContaining({
        headers: expect.not.objectContaining({ Authorization: expect.any(String) }),
      }),
    )
  })

  it('does not send Authorization for undefined or null token values', async () => {
    for (const token of [undefined, null]) {
      useAuthStore.setState({ token: token as any })
      localStorageMock.getItem.mockReturnValue(null)
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true }),
      })

      await apiClient('/missing-token')
    }

    for (const call of fetchMock.mock.calls) {
      expect(call[1].headers).not.toHaveProperty('Authorization')
    }
  })

  it('constructs URL correctly from VITE_API_URL + endpoint', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ success: true }),
    })

    await apiClient('/endpoint')

    expect(fetchMock).toHaveBeenCalledWith(
      `${baseUrl}/api/endpoint`,
      expect.any(Object),
    )
  })
})
