export type ParticipantSplitRow = {
    id: string;
    user_id: string;
    share_amount: {
        toString(): string;
    } | number | string;
    settled_amount?: {
        toString(): string;
    } | number | string | null;
    expenses: {
        paid_by: string;
        expense_date?: Date | string | null;
    };
};
export declare function toMoney(value: {
    toString(): string;
} | number | string | null | undefined): number;
export declare function getOutstandingAmount(row: Pick<ParticipantSplitRow, 'share_amount' | 'settled_amount'>): number;
export declare function isFullySettled(row: Pick<ParticipantSplitRow, 'share_amount' | 'settled_amount'>): boolean;
export declare function getSignedOutstanding(split: ParticipantSplitRow, userId: string): number;
export declare function sumOutstandingOwedByPayer(splits: ParticipantSplitRow[], payerId: string, receiverId: string): number;
export type FifoAllocation = {
    participantId: string;
    amount: number;
    newSettledAmount: number;
    fullySettled: boolean;
};
export declare function allocateSettlementFifo(rows: ParticipantSplitRow[], payerId: string, receiverId: string, paymentAmount: number): FifoAllocation[];
export declare function sumAllocatedAmount(allocations: FifoAllocation[]): number;
