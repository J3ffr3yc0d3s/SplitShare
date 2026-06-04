/** Participant row with expense payer for balance / settlement math. */
export type ParticipantSplitRow = {
  id: string;
  user_id: string;
  share_amount: { toString(): string } | number | string;
  settled_amount?: { toString(): string } | number | string | null;
  expenses: { paid_by: string; expense_date?: Date | string | null };
};

export function toMoney(value: { toString(): string } | number | string | null | undefined): number {
  return Number(value ?? 0);
}

export function getOutstandingAmount(row: Pick<ParticipantSplitRow, 'share_amount' | 'settled_amount'>): number {
  const share = toMoney(row.share_amount);
  const settled = toMoney(row.settled_amount);
  return Math.max(0, Math.round((share - settled) * 100) / 100);
}

export function isFullySettled(row: Pick<ParticipantSplitRow, 'share_amount' | 'settled_amount'>): boolean {
  return getOutstandingAmount(row) <= 0;
}

/** Signed outstanding for balance aggregation (positive = owed to userId). */
export function getSignedOutstanding(split: ParticipantSplitRow, userId: string): number {
  const outstanding = getOutstandingAmount(split);
  if (outstanding <= 0) {
    return 0;
  }

  const isPayer = split.expenses.paid_by === userId;
  if (isPayer && split.user_id === userId) {
    return 0;
  }

  return isPayer ? outstanding : -outstanding;
}

/** Total the payer still owes the receiver across expense splits. */
export function sumOutstandingOwedByPayer(
  splits: ParticipantSplitRow[],
  payerId: string,
  receiverId: string,
): number {
  return splits
    .filter((row) => row.user_id === payerId && row.expenses.paid_by === receiverId)
    .reduce((sum, row) => sum + getOutstandingAmount(row), 0);
}

export type FifoAllocation = { participantId: string; amount: number; newSettledAmount: number; fullySettled: boolean };

/** Apply payment FIFO by expense date; returns per-row updates (does not mutate). */
export function allocateSettlementFifo(
  rows: ParticipantSplitRow[],
  payerId: string,
  receiverId: string,
  paymentAmount: number,
): FifoAllocation[] {
  const ordered = rows
    .filter((row) => row.user_id === payerId && row.expenses.paid_by === receiverId)
    .filter((row) => getOutstandingAmount(row) > 0)
    .sort((a, b) => {
      const dateA = new Date(a.expenses.expense_date ?? 0).getTime();
      const dateB = new Date(b.expenses.expense_date ?? 0).getTime();
      return dateA - dateB;
    });

  let remaining = Math.round(paymentAmount * 100) / 100;
  const allocations: FifoAllocation[] = [];

  for (const row of ordered) {
    if (remaining <= 0) {
      break;
    }

    const outstanding = getOutstandingAmount(row);
    const apply = Math.min(remaining, outstanding);
    const newSettled = Math.round((toMoney(row.settled_amount) + apply) * 100) / 100;
    const share = toMoney(row.share_amount);

    allocations.push({
      participantId: row.id,
      amount: apply,
      newSettledAmount: newSettled,
      fullySettled: newSettled >= share,
    });

    remaining = Math.round((remaining - apply) * 100) / 100;
  }

  return allocations;
}

export function sumAllocatedAmount(allocations: FifoAllocation[]): number {
  return Math.round(allocations.reduce((sum, item) => sum + item.amount, 0) * 100) / 100;
}
