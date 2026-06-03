import { create } from 'zustand'

type Theme = 'light' | 'dark'

interface UIStore {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light'

  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored

  if (typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  return 'light'
}

export const useUIStore = create<UIStore>((set, get) => ({
  theme: getInitialTheme(),
  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', next)
    set({ theme: next })
  },
  setTheme: (theme) => {
    localStorage.setItem('theme', theme)
    set({ theme })
  },
}))
