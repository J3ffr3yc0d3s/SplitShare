"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const expenses_service_1 = require("./expenses.service");
describe('normalizeExpenseParticipants', () => {
    const payerId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
    const friendId = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
    it('removes duplicate user ids', () => {
        const result = (0, expenses_service_1.normalizeExpenseParticipants)(payerId, [
            { userId: friendId, amount: 250 },
            { userId: friendId, amount: 250 },
        ]);
        expect(result).toEqual([{ userId: friendId, amount: 250 }]);
    });
    it('rejects payer as participant', () => {
        expect(() => (0, expenses_service_1.normalizeExpenseParticipants)(payerId, [{ userId: payerId, amount: 100 }])).toThrow(common_1.BadRequestException);
    });
    it('keeps first share when duplicate user ids are sent', () => {
        const result = (0, expenses_service_1.normalizeExpenseParticipants)(payerId, [
            { userId: friendId, amount: 100 },
            { userId: friendId, amount: 200 },
        ]);
        expect(result).toEqual([{ userId: friendId, amount: 100 }]);
    });
});
//# sourceMappingURL=expenses-normalize.spec.js.map