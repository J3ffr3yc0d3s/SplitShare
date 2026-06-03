import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
export declare class ExpensesController {
    private readonly expensesService;
    constructor(expensesService: ExpensesService);
    getAll(req: any): Promise<({
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
    getById(id: string, req: any): Promise<{
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
    create(req: any, dto: CreateExpenseDto): Promise<{
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
    update(id: string, req: any, dto: UpdateExpenseDto): Promise<{
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
    delete(id: string, req: any): Promise<{
        success: boolean;
    }>;
}
