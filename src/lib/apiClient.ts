import { useAuthStore } from '@/stores/authStore'
import type { ApiResponse } from '@/types'

/** NestJS returns the resource directly; mocks use `{ data }`. Normalize both shapes. */
export function toApiResponse<T>(body: unknown): ApiResponse<T> {
  if (
    body !== null &&
    typeof body === 'object' &&
    'data' in body &&
    !('accessToken' in body)
  ) {
    return body as ApiResponse<T>
  }

  return { data: body as T }
}

function getPersistedToken(): string | null {
  if (typeof window === 'undefined') return null

  try {
    const authToken = window.localStorage.getItem('auth-token')?.trim()
    if (authToken) return authToken

    const raw = window.localStorage.getItem('auth-store')
    if (!raw) return null

    const parsed = JSON.parse(raw)
    const persistedToken = parsed?.state?.token ?? parsed?.token
    return typeof persistedToken === 'string' && persistedToken.trim() ? persistedToken.trim() : null
  } catch (error) {
    console.warn('[apiClient] failed to parse persisted auth-store', error)
    return null
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Read token directly from Zustand store (works outside React components)
  let token = useAuthStore.getState().token

  if (!token) {
    token = getPersistedToken()
  }

  token = typeof token === 'string' ? token.trim() : null

  const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'
  const url = `${BASE_URL}${endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`}`
  const authHeader = token ? `Bearer ${token}` : null

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (authHeader && authHeader !== 'Bearer undefined' && authHeader !== 'Bearer null' && authHeader.trim() !== 'Bearer') {
    headers.Authorization = authHeader
  }

  const res = await fetch(url, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const error = typeof res.text === 'function' ? await res.text() : ''
    console.error('API Error:', res.status, error)
    throw new Error(error || `API error ${res.status}`)
  }

  const body = await res.json()
  return body as T
}

/** Like apiClient but always returns the frontend ApiResponse envelope. */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const body = await apiClient<unknown>(endpoint, options)
  return toApiResponse<T>(body)
}
