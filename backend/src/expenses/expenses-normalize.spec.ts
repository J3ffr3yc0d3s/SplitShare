import { BadRequestException } from '@nestjs/common'
import { normalizeExpenseParticipants } from './expenses.service'

describe('normalizeExpenseParticipants', () => {
  const payerId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
  const friendId = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'

  it('removes duplicate user ids', () => {
    const result = normalizeExpenseParticipants(payerId, [
      { userId: friendId, amount: 250 },
      { userId: friendId, amount: 250 },
    ])

    expect(result).toEqual([{ userId: friendId, amount: 250 }])
  })

  it('rejects payer as participant', () => {
    expect(() =>
      normalizeExpenseParticipants(payerId, [{ userId: payerId, amount: 100 }]),
    ).toThrow(BadRequestException)
  })

  it('keeps first share when duplicate user ids are sent', () => {
    const result = normalizeExpenseParticipants(payerId, [
      { userId: friendId, amount: 100 },
      { userId: friendId, amount: 200 },
    ])
    expect(result).toEqual([{ userId: friendId, amount: 100 }])
  })
})
