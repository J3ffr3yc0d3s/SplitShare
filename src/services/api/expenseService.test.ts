import { describe, expect, it } from 'vitest'
import { mapExpense } from './expenseService'

describe('mapExpense', () => {
  it('maps Prisma expense fields to frontend Expense shape', () => {
    const mapped = mapExpense({
      id: '499f21e2-5f42-4779-82ae-e11497cb9a21',
      title: 'Test Dinner',
      description: 'notes',
      amount: '50',
      paid_by: '2dd55dce-c65a-46dd-b76b-42915f11ed8e',
      category: 'food',
      expense_date: '2026-06-06T00:00:00.000Z',
      created_by: '2dd55dce-c65a-46dd-b76b-42915f11ed8e',
      created_at: '2026-06-04T19:33:52.539Z',
      expense_participants: [
        {
          id: 'p1',
          expense_id: '499f21e2-5f42-4779-82ae-e11497cb9a21',
          user_id: 'user-b',
          share_amount: '25',
          is_settled: false,
        },
      ],
    })

    expect(mapped).toMatchObject({
      id: '499f21e2-5f42-4779-82ae-e11497cb9a21',
      title: 'Test Dinner',
      description: 'notes',
      amount: 50,
      paidBy: '2dd55dce-c65a-46dd-b76b-42915f11ed8e',
      category: 'food',
      splitType: 'equal',
    })
    expect(mapped.participants).toEqual([{ userId: 'user-b', amount: 25 }])
    expect(mapped.date).toEqual(new Date('2026-06-06T00:00:00.000Z'))
  })
})
