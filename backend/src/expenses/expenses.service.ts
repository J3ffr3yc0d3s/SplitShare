import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseParticipantDto } from './dto/expense-participant.dto';

/** Ensures at most one participant row per user and never includes the payer. */
export function normalizeExpenseParticipants(
  payerId: string,
  participants: ExpenseParticipantDto[],
): ExpenseParticipantDto[] {
  const seen = new Set<string>();
  const normalized: ExpenseParticipantDto[] = [];

  for (const participant of participants) {
    const userId = participant.userId?.trim();
    if (!userId) continue;

    if (userId === payerId) {
      throw new BadRequestException('Payer cannot be listed as a participant');
    }

    if (seen.has(userId)) {
      continue;
    }

    seen.add(userId);
    normalized.push({ ...participant, userId });
  }

  return normalized;
}

/** Converts API date strings (e.g. YYYY-MM-DD from HTML inputs) to Date for Prisma DateTime fields. */
function toExpenseDate(value: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T00:00:00.000Z`);
  }
  return new Date(value);
}

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
    console.log('dto.participants', dto.participants);
    const participants = normalizeExpenseParticipants(userId, dto.participants);

    return this.prisma.expenses.create({
      data: {
        title: dto.title,
        description: dto.description,
        amount: dto.amount,
        category: dto.category,
        paid_by: userId,
        created_by: userId,
        expense_date: toExpenseDate(dto.expenseDate),
        group_id: dto.groupId,
        expense_participants: {
          create: participants.map((participant) => ({
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
    if (dto.expenseDate !== undefined) data.expense_date = toExpenseDate(dto.expenseDate);

    if (dto.participants !== undefined) {
      const participants = normalizeExpenseParticipants(userId, dto.participants);
      data.expense_participants = {
        deleteMany: {},
        create: participants.map((participant) => ({
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
