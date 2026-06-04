"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const settlements_service_1 = require("./settlements.service");
const payerId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const receiverId = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
describe('SettlementsService', () => {
    const splits = [
        {
            id: 'part-1',
            user_id: payerId,
            share_amount: 30,
            settled_amount: 0,
            expenses: { paid_by: receiverId, expense_date: new Date('2026-01-01') },
        },
        {
            id: 'part-2',
            user_id: payerId,
            share_amount: 20,
            settled_amount: 0,
            expenses: { paid_by: receiverId, expense_date: new Date('2026-01-02') },
        },
    ];
    const createMocks = () => {
        const expenseParticipants = {
            findMany: jest.fn().mockResolvedValue(splits),
            update: jest.fn().mockResolvedValue({}),
        };
        const settlements = {
            create: jest.fn().mockResolvedValue({
                id: 'settlement-1',
                payer_id: payerId,
                receiver_id: receiverId,
                amount: 10,
                status: 'completed',
            }),
        };
        const tx = { expense_participants: expenseParticipants, settlements };
        const prisma = {
            $transaction: jest.fn((fn) => fn(tx)),
            settlements: { findUnique: jest.fn(), update: jest.fn() },
        };
        return { prisma, expenseParticipants, settlements };
    };
    it('applies partial settlement FIFO and records completed settlement', async () => {
        const { prisma, expenseParticipants, settlements } = createMocks();
        const service = new settlements_service_1.SettlementsService(prisma);
        await service.create(payerId, { to: receiverId, amount: 10 });
        expect(expenseParticipants.update).toHaveBeenCalledWith({
            where: { id: 'part-1' },
            data: { settled_amount: 10, is_settled: false },
        });
        expect(settlements.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                payer_id: payerId,
                receiver_id: receiverId,
                amount: 10,
                status: 'completed',
            }),
        });
    });
    it('rejects settlement above outstanding balance', async () => {
        const { prisma } = createMocks();
        const service = new settlements_service_1.SettlementsService(prisma);
        await expect(service.create(payerId, { to: receiverId, amount: 100 })).rejects.toThrow(common_1.BadRequestException);
    });
});
//# sourceMappingURL=settlements.service.spec.js.map