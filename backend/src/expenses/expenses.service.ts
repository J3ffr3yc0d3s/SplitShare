import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(userId: string) {
    return this.prisma.expenses.findMany({
      where: {
        OR: [
          { paid_by: userId },
          { expense_participants: { some: { user_id: userId } } },
        ],
      },
      include: { expense_participants: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async getById(id: string, userId: string) {
    const expense = await this.prisma.expenses.findUnique({
      where: { id },
      include: { expense_participants: true },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    const hasAccess =
      expense.paid_by === userId ||
      expense.expense_participants.some((participant) => participant.user_id === userId);

    if (!hasAccess) {
      throw new NotFoundException('Expense not found');
    }

    return expense;
  }

  async create(userId: string, dto: CreateExpenseDto) {
    return this.prisma.expenses.create({
      data: {
        title: dto.description,
        description: dto.description,
        amount: dto.amount,
        category: dto.category,
        paid_by: userId,
        created_by: userId,
        expense_date: dto.expenseDate,
        group_id: dto.groupId,
        expense_participants: {
          create: dto.participants.map((participant) => ({
            user_id: participant.userId,
            share_amount: participant.amount,
          })),
        },
      },
      include: { expense_participants: true },
    });
  }

  async update(id: string, userId: string, dto: UpdateExpenseDto) {
    const expense = await this.getById(id, userId);

    const data: any = {};
    if (dto.description !== undefined) {
      data.title = dto.description;
      data.description = dto.description;
    }
    if (dto.amount !== undefined) data.amount = dto.amount;
    if (dto.category !== undefined) data.category = dto.category;
    if (dto.groupId !== undefined) data.group_id = dto.groupId;
    if (dto.currency !== undefined) data.currency = dto.currency;
    if (dto.expenseDate !== undefined) data.expense_date = dto.expenseDate;

    if (dto.participants !== undefined) {
      data.expense_participants = {
        deleteMany: {},
        create: dto.participants.map((participant) => ({
          user_id: participant.userId,
          share_amount: participant.amount,
        })),
      };
    }

    return this.prisma.expenses.update({
      where: { id: expense.id },
      data,
      include: { expense_participants: true },
    });
  }

  async delete(id: string, userId: string) {
    await this.getById(id, userId);
    await this.prisma.expenses.delete({ where: { id } });
    return { success: true };
  }
}
