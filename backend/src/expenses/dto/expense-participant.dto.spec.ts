import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ExpenseParticipantDto } from './expense-participant.dto';

const validUuid = '68cf5157-a27e-44fb-9f8e-48f71892df6e';

describe('ExpenseParticipantDto', () => {
  const validateParticipant = (payload: { userId: string; amount: number }) => {
    const dto = plainToInstance(ExpenseParticipantDto, payload);
    return validate(dto);
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
