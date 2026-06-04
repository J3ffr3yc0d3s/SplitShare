import { describe, expect, it } from 'vitest'
import { splitAmountEqually, splitEqualFriendShares, equalSplitTotalsMatch, sumsToTotal } from './splitUtils'

describe('splitAmountEqually', () => {
  it('splits evenly when divisible', () => {
    expect(splitAmountEqually(1000, 4)).toEqual([250, 250, 250, 250])
    expect(sumsToTotal(splitAmountEqually(1000, 4), 1000)).toBe(true)
  })

  it('distributes remainder cents for uneven splits', () => {
    expect(splitAmountEqually(1000, 3)).toEqual([333.33, 333.33, 333.34])
    expect(sumsToTotal(splitAmountEqually(1000, 3), 1000)).toBe(true)
  })

  it('handles small amounts', () => {
    const shares = splitAmountEqually(10, 3)
    expect(shares).toEqual([3.33, 3.33, 3.34])
    expect(sumsToTotal(shares, 10)).toBe(true)
  })
})

describe('splitEqualFriendShares', () => {
  it('splits among payer plus friends (1000 / 4 people)', () => {
    expect(splitEqualFriendShares(1000, 3)).toEqual([250, 250, 250])
    expect(equalSplitTotalsMatch(1000, splitEqualFriendShares(1000, 3))).toBe(true)
  })

  it('splits among payer plus one friend', () => {
    expect(splitEqualFriendShares(1000, 1)).toEqual([500])
    expect(equalSplitTotalsMatch(1000, splitEqualFriendShares(1000, 1))).toBe(true)
  })

  it('puts remainder cents on implicit payer share', () => {
    const shares = splitEqualFriendShares(1000, 2)
    expect(shares).toEqual([333.33, 333.33])
    expect(equalSplitTotalsMatch(1000, shares)).toBe(true)
  })
})
