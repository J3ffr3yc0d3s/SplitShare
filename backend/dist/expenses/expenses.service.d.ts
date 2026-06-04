import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseParticipantDto } from './dto/expense-participant.dto';
export declare function normalizeExpenseParticipants(payerId: string, participants: ExpenseParticipantDto[]): ExpenseParticipantDto[];
export declare class ExpensesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAll(userId: string): Promise<({
        expense_participants: {
            id: string;
            user_id: string;
            expense_id: string;
            share_amount: import("@prisma/client/runtime/library").Decimal;
            settled_amount: import("@prisma/client/runtime/library").Decimal;
            is_settled: boolean;
        }[];
    } & {
        id: string;
        created_at: Date | null;
        title: string;
        description: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        paid_by: string;
        group_id: string | null;
        category: string;
        expense_date: Date;
        created_by: string;
    })[]>;
    getById(id: string, userId: string): Promise<{
        expense_participants: {
            id: string;
            user_id: string;
            expense_id: string;
            share_amount: import("@prisma/client/runtime/library").Decimal;
            settled_amount: import("@prisma/client/runtime/library").Decimal;
            is_settled: boolean;
        }[];
    } & {
        id: string;
        created_at: Date | null;
        title: string;
        description: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        paid_by: string;
        group_id: string | null;
        category: string;
        expense_date: Date;
        created_by: string;
    }>;
    create(userId: string, dto: CreateExpenseDto): Promise<{
        expense_participants: {
            id: string;
            user_id: string;
            expense_id: string;
            share_amount: import("@prisma/client/runtime/library").Decimal;
            settled_amount: import("@prisma/client/runtime/library").Decimal;
            is_settled: boolean;
        }[];
    } & {
        id: string;
        created_at: Date | null;
        title: string;
        description: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        paid_by: string;
        group_id: string | null;
        category: string;
        expense_date: Date;
        created_by: string;
    }>;
    update(id: string, userId: string, dto: UpdateExpenseDto): Promise<{
        expense_participants: {
            id: string;
            user_id: string;
            expense_id: string;
            share_amount: import("@prisma/client/runtime/library").Decimal;
            settled_amount: import("@prisma/client/runtime/library").Decimal;
            is_settled: boolean;
        }[];
    } & {
        id: string;
        created_at: Date | null;
        title: string;
        description: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        paid_by: string;
        group_id: string | null;
        category: string;
        expense_date: Date;
        created_by: string;
    }>;
    delete(id: string, userId: string): Promise<{
        success: boolean;
    }>;
}
