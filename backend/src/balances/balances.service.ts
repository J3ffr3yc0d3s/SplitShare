import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { getSignedOutstanding } from '../common/outstanding.util';

@Injectable()
export class BalancesService {
  constructor(private readonly prisma: PrismaService) {}

  private aggregateBalances(userId: string, splits: Array<any>) {
    const balances = new Map<string, { id: string; userId: string; friendId: string; amount: number; lastUpdated: Date }>();

    splits.forEach((split) => {
      const signed = getSignedOutstanding(split, userId);
      if (signed === 0) {
        return;
      }

      const expense = split.expenses;
      const isPayer = expense.paid_by === userId;
      const friendId = isPayer ? split.user_id : expense.paid_by;
      if (!friendId || friendId === userId) {
        return;
      }

      const key = `${userId}-${friendId}`;
      const existing = balances.get(key);

      if (existing) {
        existing.amount += signed;
        existing.lastUpdated = new Date();
      } else {
        balances.set(key, {
          id: `balance-${userId}-${friendId}`,
          userId,
          friendId,
          amount: signed,
          lastUpdated: new Date(),
        });
      }
    });

    return Array.from(balances.values());
  }

  private async loadUnsettledSplits(userId: string) {
    const splits = await this.prisma.expense_participants.findMany({
      where: {
        OR: [{ user_id: userId }, { expenses: { paid_by: userId } }],
      },
      include: {
        expenses: {
          select: { paid_by: true, expense_date: true },
        },
      },
    });

    return splits.filter((split) => getSignedOutstanding(split, userId) !== 0);
  }

  async getBalances(userId: string) {
    const splits = await this.loadUnsettledSplits(userId);
    return this.aggregateBalances(userId, splits);
  }

  async getBalanceBetweenUsers(userId: string, friendId: string) {
    const balances = await this.getBalances(userId);
    return balances.find((balance) => balance.friendId === friendId) || null;
  }

  async getTotal(userId: string) {
    const balances = await this.getBalances(userId);
    return balances.reduce(
      (acc, balance) => {
        if (balance.amount > 0) {
          acc.owedToYou += balance.amount;
        } else {
          acc.youOwe += Math.abs(balance.amount);
        }
        return acc;
      },
      { owedToYou: 0, youOwe: 0 },
    );
  }
}
