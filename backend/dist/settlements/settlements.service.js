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
    async updateStatus(id, userId, dto) {
        const settlement = await this.prisma.settlements.findUnique({ where: { id } });
        if (!settlement || (settlement.payer_id !== userId && settlement.receiver_id !== userId)) {
            throw new common_1.NotFoundException('Settlement not found');
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
};
exports.SettlementsService = SettlementsService;
exports.SettlementsService = SettlementsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SettlementsService);
//# sourceMappingURL=settlements.service.js.map