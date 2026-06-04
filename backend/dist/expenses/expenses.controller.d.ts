import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
export declare class ExpensesController {
    private readonly expensesService;
    constructor(expensesService: ExpensesService);
    getAll(req: any): Promise<({
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
    getById(id: string, req: any): Promise<{
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
    create(req: any, dto: CreateExpenseDto): Promise<{
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
    update(id: string, req: any, dto: UpdateExpenseDto): Promise<{
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
    delete(id: string, req: any): Promise<{
        success: boolean;
    }>;
}
