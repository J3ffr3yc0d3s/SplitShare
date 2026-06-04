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
exports.SettlementsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const outstanding_util_1 = require("../common/outstanding.util");
let SettlementsService = class SettlementsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAll(userId) {
        return this.prisma.settlements.findMany({
            where: {
                OR: [{ payer_id: userId }, { receiver_id: userId }],
            },
            orderBy: { created_at: 'desc' },
        });
    }
    async create(userId, dto) {
        if (dto.to === userId) {
            throw new common_1.BadRequestException('Cannot settle with yourself');
        }
        if (dto.amount <= 0) {
            throw new common_1.BadRequestException('Settlement amount must be greater than 0');
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
            const maxOwed = (0, outstanding_util_1.sumOutstandingOwedByPayer)(splits, userId, dto.to);
            if (maxOwed <= 0) {
                throw new common_1.BadRequestException('No outstanding balance to settle with this friend');
            }
            if (dto.amount > maxOwed + 0.001) {
                throw new common_1.BadRequestException(`Settlement amount cannot exceed outstanding balance of ${maxOwed.toFixed(2)}`);
            }
            const allocations = (0, outstanding_util_1.allocateSettlementFifo)(splits, userId, dto.to, dto.amount);
            const applied = (0, outstanding_util_1.sumAllocatedAmount)(allocations);
            if (applied <= 0) {
                throw new common_1.BadRequestException('Settlement did not apply to any outstanding shares');
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
    async updateStatus(id, userId, dto) {
        const settlement = await this.prisma.settlements.findUnique({ where: { id } });
        if (!settlement || (settlement.payer_id !== userId && settlement.receiver_id !== userId)) {
            throw new common_1.NotFoundException('Settlement not found');
        }
        return this.prisma.settlements.update({
            where: { id },
            data: { status: dto.status ?? settlement.status },
        });
    }
};
exports.SettlementsService = SettlementsService;
exports.SettlementsService = SettlementsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SettlementsService);
//# sourceMappingURL=settlements.service.js.map