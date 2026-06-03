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
exports.ActivityService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ActivityService = class ActivityService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAll(userId) {
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
            type: 'expense_added',
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
                type: 'settlement',
                description,
                relatedId: settlement.id,
                timestamp: settlement.created_at,
            };
        });
        return [...expenseActivities, ...settlementActivities].sort((a, b) => new Date(b.timestamp ?? 0).getTime() - new Date(a.timestamp ?? 0).getTime());
    }
};
exports.ActivityService = ActivityService;
exports.ActivityService = ActivityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ActivityService);
//# sourceMappingURL=activity.service.js.map