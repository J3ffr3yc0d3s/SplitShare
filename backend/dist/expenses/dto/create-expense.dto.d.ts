export declare class ExpenseParticipantDto {
    userId: string;
    amount: number;
}
export declare class CreateExpenseDto {
    description: string;
    amount: number;
    expenseDate: string;
    category?: string;
    participants: ExpenseParticipantDto[];
    splitType: string;
    currency?: string;
    groupId?: string;
}
