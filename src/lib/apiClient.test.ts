import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from './apiClient'

const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

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
  })

  it('sends correct Content-Type header', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ success: true }),
    })

    await apiClient('/test', { method: 'POST', headers: { 'X-Test': '1' }, body: JSON.stringify({}) })

    expect(fetchMock).toHaveBeenCalledWith(
      `${baseUrl}/test`,
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
      `${baseUrl}/auth-test`,
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer token-123' }),
      }),
    )
  })

  it('constructs URL correctly from VITE_API_URL + endpoint', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ success: true }),
    })

    await apiClient('/endpoint')

    expect(fetchMock).toHaveBeenCalledWith(
      `${baseUrl}/endpoint`,
      expect.any(Object),
    )
  })
})
