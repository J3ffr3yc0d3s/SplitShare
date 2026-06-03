import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getMetrics(req: any): Promise<{
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
    getMonthlyTrend(req: any): Promise<{
        month: string;
        amount: number;
    }[]>;
    getCategoryBreakdown(req: any): Promise<{
        category: string;
        amount: number;
    }[]>;
}
