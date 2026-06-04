import { describe, expect, it } from 'vitest'
import { mapActivity } from './activityService'

describe('mapActivity', () => {
  it('converts ISO timestamp strings to Date', () => {
    const mapped = mapActivity({
      id: 'a1',
      userId: 'u1',
      type: 'settlement',
      description: 'Paid Jane $25',
      relatedId: 's1',
      timestamp: '2026-06-05T14:30:00.000Z',
    })

    expect(mapped.timestamp).toBeInstanceOf(Date)
    expect(mapped.timestamp.toISOString()).toBe('2026-06-05T14:30:00.000Z')
  })
})
