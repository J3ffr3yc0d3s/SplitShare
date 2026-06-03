import { beforeEach, describe, expect, it } from 'vitest'
import { useUIStore } from './uiStore'

describe('ui store', () => {
  beforeEach(() => {
    useUIStore.setState({ theme: 'light' })
  })

  it('initial theme is light or dark', () => {
    const theme = useUIStore.getState().theme
    expect(['light', 'dark']).toContain(theme)
  })

  it('toggleTheme() switches from light to dark', () => {
    useUIStore.setState({ theme: 'light' })
    useUIStore.getState().toggleTheme()
    expect(useUIStore.getState().theme).toBe('dark')
  })

  it('toggleTheme() switches from dark to light', () => {
    useUIStore.setState({ theme: 'dark' })
    useUIStore.getState().toggleTheme()
    expect(useUIStore.getState().theme).toBe('light')
  })

  it('setTheme("light") sets theme to light', () => {
    useUIStore.getState().setTheme('light')
    expect(useUIStore.getState().theme).toBe('light')
  })
})
