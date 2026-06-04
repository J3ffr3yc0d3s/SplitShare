import { IsNumber, IsUUID } from 'class-validator';

export class ExpenseParticipantDto {
  @IsUUID('4')
  userId: string;

  @IsNumber()
  amount: number;
}
