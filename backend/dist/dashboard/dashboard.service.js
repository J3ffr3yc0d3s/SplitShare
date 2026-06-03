"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DashboardService = class DashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getBalanceSplits(userId) {
        return this.prisma.expense_participants.findMany({
            where: {
                is_settled: false,
                OR: [
                    { user_id: userId },
                    { expenses: { paid_by: userId } },
                ],
            },
            include: {
                expenses: {
                    select: { paid_by: true },
                },
            },
        });
    }
    computeBalanceSummary(userId, splits) {
        let owedToYou = 0;
        let youOwe = 0;
        splits.forEach((split) => {
            const isPayer = split.expenses.paid_by === userId;
            const amount = isPayer ? Number(split.share_amount) : -Number(split.share_amount);
            if (amount > 0) {
                owedToYou += amount;
            }
            else {
                youOwe += Math.abs(amount);
            }
        });
        return { owedToYou, youOwe };
    }
    buildMonthlyTrend(expenses) {
        const months = new Map();
        expenses.forEach((expense) => {
            const date = new Date(expense.expense_date);
            const month = date.toLocaleString('en-US', { month: 'short' });
            months.set(month, (months.get(month) ?? 0) + Number(expense.amount));
        });
        return Array.from(months.entries()).map(([month, amount]) => ({ month, amount }));
    }
    buildCategoryBreakdown(expenses) {
        const categories = new Map();
        expenses.forEach((expense) => {
            const category = expense.category ?? 'Other';
            categories.set(category, (categories.get(category) ?? 0) + Number(expense.amount));
        });
        return Array.from(categories.entries()).map(([category, amount]) => ({ category, amount }));
    }
    async getMetrics(userId) {
        const [expenseCount, totalAmount, friendsCount, recentActivity] = await Promise.all([
            this.prisma.expenses.count({ where: { created_by: userId } }),
            this.prisma.expenses.aggregate({ where: { created_by: userId }, _sum: { amount: true } }),
            this.prisma.friendships.count({ where: { OR: [{ user_a_id: userId }, { user_b_id: userId }] } }),
            this.prisma.expenses.findMany({
                where: { created_by: userId },
                take: 5,
                orderBy: { created_at: 'desc' },
            }),
        ]);
        const settlementsCount = await this.prisma.settlements.count({
            where: { OR: [{ payer_id: userId }, { receiver_id: userId }] },
        });
        const splitBalances = await this.getBalanceSplits(userId);
        const balanceSummary = this.computeBalanceSummary(userId, splitBalances);
        const expenses = await this.prisma.expenses.findMany({
            where: { created_by: userId },
        });
        return {
            expenseCount,
            totalExpenses: Number(totalAmount._sum.amount ?? 0),
            totalOwed: balanceSummary.owedToYou,
            totalOwing: balanceSummary.youOwe,
            monthlyTrend: this.buildMonthlyTrend(expenses),
            categoryBreakdown: this.buildCategoryBreakdown(expenses),
            recentActivityCount: recentActivity.length + settlementsCount,
            friendsCount,
        };
    }
    async getMonthlyTrend(userId) {
        const expenses = await this.prisma.expenses.findMany({
            where: { created_by: userId },
        });
        return this.buildMonthlyTrend(expenses);
    }
    async getCategoryBreakdown(userId) {
        const expenses = await this.prisma.expenses.findMany({
            where: { created_by: userId },
        });
        return this.buildCategoryBreakdown(expenses);
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map