import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActivityService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(userId: string) {
    const expenses = await this.prisma.expenses.findMany({
      where: {
        OR: [{ created_by: userId }, { paid_by: userId }],
      },
      include: {
        users_expenses_paid_byTousers: true,
        users_expenses_created_byTousers: true,
      },
    });

    const settlements = await this.prisma.settlements.findMany({
      where: {
        OR: [{ payer_id: userId }, { receiver_id: userId }],
      },
      include: {
        users_settlements_payer_idTousers: true,
        users_settlements_receiver_idTousers: true,
      },
    });

    const expenseActivities = expenses.map((expense) => ({
      id: expense.id,
      userId,
      type: 'expense_added' as const,
      description: `Expense: ${expense.title}`,
      relatedId: expense.id,
      timestamp: expense.created_at ?? expense.expense_date,
    }));

    const settlementActivities = settlements.map((settlement) => {
      const isPayer = settlement.payer_id === userId;
      const otherUser = isPayer
        ? settlement.users_settlements_receiver_idTousers
        : settlement.users_settlements_payer_idTousers;
      const description = isPayer
        ? `Paid ${otherUser.name} $${Number(settlement.amount)}`
        : `${otherUser.name} paid you $${Number(settlement.amount)}`;

      return {
        id: settlement.id,
        userId,
        type: 'settlement' as const,
        description,
        relatedId: settlement.id,
        timestamp: settlement.created_at,
      };
    });

    return [...expenseActivities, ...settlementActivities].sort(
      (a, b) => new Date(b.timestamp ?? 0).getTime() - new Date(a.timestamp ?? 0).getTime(),
    );
  }
}
