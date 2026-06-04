"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const expense_participant_dto_1 = require("./expense-participant.dto");
const validUuid = '68cf5157-a27e-44fb-9f8e-48f71892df6e';
describe('ExpenseParticipantDto', () => {
    const validateParticipant = (payload) => {
        const dto = (0, class_transformer_1.plainToInstance)(expense_participant_dto_1.ExpenseParticipantDto, payload);
        return (0, class_validator_1.validate)(dto);
    };
    it('accepts a valid UUID', async () => {
        const errors = await validateParticipant({ userId: validUuid, amount: 25 });
        expect(errors).toHaveLength(0);
    });
    it('rejects an invalid UUID', async () => {
        for (const userId of ['user-1', 'abc', 'test']) {
            const errors = await validateParticipant({ userId, amount: 10 });
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].property).toBe('userId');
            expect(errors[0].constraints).toHaveProperty('isUuid');
        }
    });
    it('rejects an empty string userId', async () => {
        const errors = await validateParticipant({ userId: '', amount: 10 });
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('userId');
        expect(errors[0].constraints).toHaveProperty('isUuid');
    });
});
//# sourceMappingURL=expense-participant.dto.spec.js.map