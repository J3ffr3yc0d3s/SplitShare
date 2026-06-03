import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  private async getBalanceSplits(userId: string) {
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

  private computeBalanceSummary(userId: string, splits: Array<any>) {
    let owedToYou = 0;
    let youOwe = 0;

    splits.forEach((split) => {
      const isPayer = split.expenses.paid_by === userId;
      const amount = isPayer ? Number(split.share_amount) : -Number(split.share_amount);

      if (amount > 0) {
        owedToYou += amount;
      } else {
        youOwe += Math.abs(amount);
      }
    });

    return { owedToYou, youOwe };
  }

  private buildMonthlyTrend(expenses: Array<any>) {
    const months = new Map<string, number>();

    expenses.forEach((expense) => {
      const date = new Date(expense.expense_date);
      const month = date.toLocaleString('en-US', { month: 'short' });
      months.set(month, (months.get(month) ?? 0) + Number(expense.amount));
    });

    return Array.from(months.entries()).map(([month, amount]) => ({ month, amount }));
  }

  private buildCategoryBreakdown(expenses: Array<any>) {
    const categories = new Map<string, number>();

    expenses.forEach((expense) => {
      const category = expense.category ?? 'Other';
      categories.set(category, (categories.get(category) ?? 0) + Number(expense.amount));
    });

    return Array.from(categories.entries()).map(([category, amount]) => ({ category, amount }));
  }

  async getMetrics(userId: string) {
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

  async getMonthlyTrend(userId: string) {
    const expenses = await this.prisma.expenses.findMany({
      where: { created_by: userId },
    });
    return this.buildMonthlyTrend(expenses);
  }

  async getCategoryBreakdown(userId: string) {
    const expenses = await this.prisma.expenses.findMany({
      where: { created_by: userId },
    });
    return this.buildCategoryBreakdown(expenses);
  }
}
