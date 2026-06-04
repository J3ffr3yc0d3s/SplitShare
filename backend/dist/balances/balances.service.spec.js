"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const balances_service_1 = require("./balances.service");
const userId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const friendId = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
describe('BalancesService', () => {
    it('aggregates outstanding amounts after partial settlement', async () => {
        const splits = [
            {
                id: 'p1',
                user_id: userId,
                share_amount: 50,
                settled_amount: 20,
                expenses: { paid_by: friendId, expense_date: new Date() },
            },
        ];
        const prisma = {
            expense_participants: {
                findMany: jest.fn().mockResolvedValue(splits),
            },
        };
        const service = new balances_service_1.BalancesService(prisma);
        const balances = await service.getBalances(userId);
        expect(balances).toHaveLength(1);
        expect(balances[0].friendId).toBe(friendId);
        expect(balances[0].amount).toBe(-30);
    });
    it('excludes fully settled participant rows', async () => {
        const splits = [
            {
                id: 'p1',
                user_id: userId,
                share_amount: 50,
                settled_amount: 50,
                expenses: { paid_by: friendId, expense_date: new Date() },
            },
        ];
        const prisma = {
            expense_participants: {
                findMany: jest.fn().mockResolvedValue(splits),
            },
        };
        const service = new balances_service_1.BalancesService(prisma);
        const balances = await service.getBalances(userId);
        expect(balances).toHaveLength(0);
    });
});
//# sourceMappingURL=balances.service.spec.js.map