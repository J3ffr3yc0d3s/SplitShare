import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSettlementDto } from './dto/create-settlement.dto';
import { UpdateSettlementDto } from './dto/update-settlement.dto';
import {
  allocateSettlementFifo,
  sumAllocatedAmount,
  sumOutstandingOwedByPayer,
} from '../common/outstanding.util';

@Injectable()
export class SettlementsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(userId: string) {
    return this.prisma.settlements.findMany({
      where: {
        OR: [{ payer_id: userId }, { receiver_id: userId }],
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async create(userId: string, dto: CreateSettlementDto) {
    if (dto.to === userId) {
      throw new BadRequestException('Cannot settle with yourself');
    }

    if (dto.amount <= 0) {
      throw new BadRequestException('Settlement amount must be greater than 0');
    }

    return this.prisma.$transaction(async (tx) => {
      const splits = await tx.expense_participants.findMany({
        where: {
          user_id: userId,
          expenses: { paid_by: dto.to },
        },
        include: {
          expenses: {
            select: { paid_by: true, expense_date: true },
          },
        },
      });

      const maxOwed = sumOutstandingOwedByPayer(splits, userId, dto.to);
      if (maxOwed <= 0) {
        throw new BadRequestException('No outstanding balance to settle with this friend');
      }

      if (dto.amount > maxOwed + 0.001) {
        throw new BadRequestException(
          `Settlement amount cannot exceed outstanding balance of ${maxOwed.toFixed(2)}`,
        );
      }

      const allocations = allocateSettlementFifo(splits, userId, dto.to, dto.amount);
      const applied = sumAllocatedAmount(allocations);

      if (applied <= 0) {
        throw new BadRequestException('Settlement did not apply to any outstanding shares');
      }

      for (const allocation of allocations) {
        await tx.expense_participants.update({
          where: { id: allocation.participantId },
          data: {
            settled_amount: allocation.newSettledAmount,
            is_settled: allocation.fullySettled,
          },
        });
      }

      return tx.settlements.create({
        data: {
          payer_id: userId,
          receiver_id: dto.to,
          amount: dto.amount,
          note: dto.note,
          status: 'completed',
        },
      });
    });
  }

  async updateStatus(id: string, userId: string, dto: UpdateSettlementDto) {
    const settlement = await this.prisma.settlements.findUnique({ where: { id } });
    if (!settlement || (settlement.payer_id !== userId && settlement.receiver_id !== userId)) {
      throw new NotFoundException('Settlement not found');
    }

    return this.prisma.settlements.update({
      where: { id },
      data: { status: dto.status ?? settlement.status },
    });
  }
}
