/** Split a total into `count` shares in cents so parts always sum to the total. */
export function splitAmountEqually(totalAmount: number, count: number): number[] {
  if (count <= 0) return []

  const totalCents = Math.round(totalAmount * 100)
  const baseCents = Math.floor(totalCents / count)
  const remainder = totalCents - baseCents * count

  return Array.from({ length: count }, (_, index) => {
    const cents = baseCents + (index >= count - remainder ? 1 : 0)
    return cents / 100
  })
}

/**
 * Equal split among payer + friends. Each friend gets the same share; remainder
 * cents stay with the payer (not stored as a participant row).
 */
export function splitEqualFriendShares(totalAmount: number, friendCount: number): number[] {
  if (friendCount <= 0) return []

  const peopleCount = friendCount + 1
  const totalCents = Math.round(totalAmount * 100)
  const perPersonCents = Math.floor(totalCents / peopleCount)
  const share = perPersonCents / 100

  return Array.from({ length: friendCount }, () => share)
}

/** Friend participant shares plus implicit payer share equals expense total. */
export function equalSplitTotalsMatch(totalAmount: number, friendShares: number[]): boolean {
  if (friendShares.length === 0) return true

  const peopleCount = friendShares.length + 1
  const totalCents = Math.round(totalAmount * 100)
  const perPersonCents = Math.floor(totalCents / peopleCount)
  const remainder = totalCents - perPersonCents * peopleCount
  const payerCents = perPersonCents + remainder
  const friendsCents = friendShares.reduce((sum, share) => sum + Math.round(share * 100), 0)

  return friendsCents + payerCents === totalCents
}

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100
}

export function sumsToTotal(shares: number[], totalAmount: number, tolerance = 0.001): boolean {
  const sum = roundMoney(shares.reduce((acc, share) => acc + share, 0))
  return Math.abs(sum - roundMoney(totalAmount)) <= tolerance
}
