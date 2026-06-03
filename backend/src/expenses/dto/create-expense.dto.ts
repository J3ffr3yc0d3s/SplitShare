import { IsArray, IsDateString, IsIn, IsNumber, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ExpenseParticipantDto {
  @IsString()
  userId: string;

  @IsNumber()
  amount: number;
}

export class CreateExpenseDto {
  @IsString()
  @MinLength(1)
  description: string;

  @IsNumber()
  amount: number;

  @IsDateString()
  expenseDate: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExpenseParticipantDto)
  participants: ExpenseParticipantDto[];

  @IsString()
  @IsIn(['equal', 'custom'])
  splitType: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  groupId?: string;
}
