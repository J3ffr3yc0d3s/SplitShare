import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
export declare class ExpensesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAll(userId: string): Promise<({
        expense_participants: {
            id: string;
            expense_id: string;
            user_id: string;
            share_amount: import("@prisma/client/runtime/library").Decimal;
            is_settled: boolean;
        }[];
    } & {
        created_by: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        id: string;
        title: string;
        description: string | null;
        paid_by: string;
        group_id: string | null;
        category: string;
        expense_date: Date;
        created_at: Date | null;
    })[]>;
    getById(id: string, userId: string): Promise<{
        expense_participants: {
            id: string;
            expense_id: string;
            user_id: string;
            share_amount: import("@prisma/client/runtime/library").Decimal;
            is_settled: boolean;
        }[];
    } & {
        created_by: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        id: string;
        title: string;
        description: string | null;
        paid_by: string;
        group_id: string | null;
        category: string;
        expense_date: Date;
        created_at: Date | null;
    }>;
    create(userId: string, dto: CreateExpenseDto): Promise<{
        expense_participants: {
            id: string;
            expense_id: string;
            user_id: string;
            share_amount: import("@prisma/client/runtime/library").Decimal;
            is_settled: boolean;
        }[];
    } & {
        created_by: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        id: string;
        title: string;
        description: string | null;
        paid_by: string;
        group_id: string | null;
        category: string;
        expense_date: Date;
        created_at: Date | null;
    }>;
    update(id: string, userId: string, dto: UpdateExpenseDto): Promise<{
        expense_participants: {
            id: string;
            expense_id: string;
            user_id: string;
            share_amount: import("@prisma/client/runtime/library").Decimal;
            is_settled: boolean;
        }[];
    } & {
        created_by: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        id: string;
        title: string;
        description: string | null;
        paid_by: string;
        group_id: string | null;
        category: string;
        expense_date: Date;
        created_at: Date | null;
    }>;
    delete(id: string, userId: string): Promise<{
        success: boolean;
    }>;
}
