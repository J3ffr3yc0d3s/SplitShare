import { ExpenseParticipantDto } from './expense-participant.dto';
export declare class UpdateExpenseDto {
    description?: string;
    amount?: number;
    expenseDate?: string;
    category?: string;
    participants?: ExpenseParticipantDto[];
    splitType?: string;
    currency?: string;
    groupId?: string;
}
