import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private getBalanceSplits;
    private computeBalanceSummary;
    private buildMonthlyTrend;
    private buildCategoryBreakdown;
    getMetrics(userId: string): Promise<{
        expenseCount: number;
        totalExpenses: number;
        totalOwed: number;
        totalOwing: number;
        monthlyTrend: {
            month: string;
            amount: number;
        }[];
        categoryBreakdown: {
            category: string;
            amount: number;
        }[];
        recentActivityCount: number;
        friendsCount: number;
    }>;
    getMonthlyTrend(userId: string): Promise<{
        month: string;
        amount: number;
    }[]>;
    getCategoryBreakdown(userId: string): Promise<{
        category: string;
        amount: number;
    }[]>;
}
