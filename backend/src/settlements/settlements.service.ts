import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSettlementDto } from './dto/create-settlement.dto';
import { UpdateSettlementDto } from './dto/update-settlement.dto';

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
    return this.prisma.settlements.create({
      data: {
        payer_id: userId,
        receiver_id: dto.to,
        amount: dto.amount,
        note: dto.note,
        status: dto.status ?? 'pending',
      },
    });
  }

  async updateStatus(id: string, userId: string, dto: UpdateSettlementDto) {
    const settlement = await this.prisma.settlements.findUnique({ where: { id } });
    if (!settlement || (settlement.payer_id !== userId && settlement.receiver_id !== userId)) {
      throw new NotFoundException('Settlement not found');
    }

    const updated = await this.prisma.settlements.update({
      where: { id },
      data: { status: dto.status ?? settlement.status },
    });

    if (updated.status === 'completed') {
      await this.prisma.expense_participants.updateMany({
        where: {
          is_settled: false,
          user_id: updated.payer_id,
          expenses: { paid_by: updated.receiver_id },
        },
        data: { is_settled: true },
      });
    }

    return updated;
  }
}
