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
exports.ExpensesService = void 0;
exports.normalizeExpenseParticipants = normalizeExpenseParticipants;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
function normalizeExpenseParticipants(payerId, participants) {
    const seen = new Set();
    const normalized = [];
    for (const participant of participants) {
        const userId = participant.userId?.trim();
        if (!userId)
            continue;
        if (userId === payerId) {
            throw new common_1.BadRequestException('Payer cannot be listed as a participant');
        }
        if (seen.has(userId)) {
            continue;
        }
        seen.add(userId);
        normalized.push({ ...participant, userId });
    }
    return normalized;
}
function toExpenseDate(value) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return new Date(`${value}T00:00:00.000Z`);
    }
    return new Date(value);
}
let ExpensesService = class ExpensesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAll(userId) {
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
    async getById(id, userId) {
        const expense = await this.prisma.expenses.findUnique({
            where: { id },
            include: { expense_participants: true },
        });
        if (!expense) {
            throw new common_1.NotFoundException('Expense not found');
        }
        const hasAccess = expense.paid_by === userId ||
            expense.expense_participants.some((participant) => participant.user_id === userId);
        if (!hasAccess) {
            throw new common_1.NotFoundException('Expense not found');
        }
        return expense;
    }
    async create(userId, dto) {
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
    async update(id, userId, dto) {
        const expense = await this.getById(id, userId);
        const data = {};
        if (dto.description !== undefined) {
            data.title = dto.description;
            data.description = dto.description;
        }
        if (dto.amount !== undefined)
            data.amount = dto.amount;
        if (dto.category !== undefined)
            data.category = dto.category;
        if (dto.groupId !== undefined)
            data.group_id = dto.groupId;
        if (dto.currency !== undefined)
            data.currency = dto.currency;
        if (dto.expenseDate !== undefined)
            data.expense_date = toExpenseDate(dto.expenseDate);
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
    async delete(id, userId) {
        await this.getById(id, userId);
        await this.prisma.expenses.delete({ where: { id } });
        return { success: true };
    }
};
exports.ExpensesService = ExpensesService;
exports.ExpensesService = ExpensesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExpensesService);
//# sourceMappingURL=expenses.service.js.map