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
exports.BalancesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BalancesService = class BalancesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    aggregateBalances(userId, splits) {
        const balances = new Map();
        splits.forEach((split) => {
            const expense = split.expenses;
            const isPayer = expense.paid_by === userId;
            const isParticipant = split.user_id === userId;
            if (isPayer && split.user_id === userId) {
                return;
            }
            const friendId = isPayer ? split.user_id : expense.paid_by;
            if (!friendId || friendId === userId) {
                return;
            }
            const amount = isPayer ? Number(split.share_amount) : -Number(split.share_amount);
            if (amount === 0) {
                return;
            }
            const key = `${userId}-${friendId}`;
            const existing = balances.get(key);
            if (existing) {
                existing.amount += amount;
                existing.lastUpdated = new Date();
            }
            else {
                balances.set(key, {
                    id: `balance-${userId}-${friendId}`,
                    userId,
                    friendId,
                    amount,
                    lastUpdated: new Date(),
                });
            }
        });
        return Array.from(balances.values());
    }
    async getBalances(userId) {
        const splits = await this.prisma.expense_participants.findMany({
            where: {
                is_settled: false,
                OR: [
                    { user_id: userId },
                    { expenses: { paid_by: userId } },
                ],
            },
            include: {
                expenses: {
                    select: { paid_by: true },
                },
            },
        });
        return this.aggregateBalances(userId, splits);
    }
    async getBalanceBetweenUsers(userId, friendId) {
        const balances = await this.getBalances(userId);
        return balances.find((balance) => balance.friendId === friendId) || null;
    }
    async getTotal(userId) {
        const balances = await this.getBalances(userId);
        return balances.reduce((acc, balance) => {
            if (balance.amount > 0) {
                acc.owedToYou += balance.amount;
            }
            else {
                acc.youOwe += Math.abs(balance.amount);
            }
            return acc;
        }, { owedToYou: 0, youOwe: 0 });
    }
};
exports.BalancesService = BalancesService;
exports.BalancesService = BalancesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BalancesService);
//# sourceMappingURL=balances.service.js.map