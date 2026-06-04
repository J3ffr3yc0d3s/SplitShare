import {
  allocateSettlementFifo,
  getOutstandingAmount,
  sumOutstandingOwedByPayer,
} from './outstanding.util';

const payerId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const receiverId = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';

describe('outstanding.util', () => {
  it('computes outstanding from share and settled amounts', () => {
    expect(getOutstandingAmount({ share_amount: 50, settled_amount: 20 })).toBe(30);
    expect(getOutstandingAmount({ share_amount: 50, settled_amount: 50 })).toBe(0);
  });

  it('sums outstanding owed by payer to receiver', () => {
    const rows = [
      {
        id: '1',
        user_id: payerId,
        share_amount: 30,
        settled_amount: 0,
        expenses: { paid_by: receiverId, expense_date: '2026-01-01' },
      },
      {
        id: '2',
        user_id: payerId,
        share_amount: 20,
        settled_amount: 5,
        expenses: { paid_by: receiverId, expense_date: '2026-01-02' },
      },
    ];
    expect(sumOutstandingOwedByPayer(rows, payerId, receiverId)).toBe(45);
  });

  it('allocates FIFO for partial then full settlement', () => {
    const rows = [
      {
        id: '1',
        user_id: payerId,
        share_amount: 30,
        settled_amount: 0,
        expenses: { paid_by: receiverId, expense_date: '2026-01-01' },
      },
      {
        id: '2',
        user_id: payerId,
        share_amount: 20,
        settled_amount: 0,
        expenses: { paid_by: receiverId, expense_date: '2026-01-02' },
      },
    ];

    const partial = allocateSettlementFifo(rows, payerId, receiverId, 10);
    expect(partial).toEqual([
      { participantId: '1', amount: 10, newSettledAmount: 10, fullySettled: false },
    ]);

    const updatedRows = rows.map((row) =>
      row.id === '1' ? { ...row, settled_amount: 10 } : row,
    );
    const full = allocateSettlementFifo(updatedRows, payerId, receiverId, 40);
    expect(full).toHaveLength(2);
    expect(full[0].amount).toBe(20);
    expect(full[1].amount).toBe(20);
  });
});
