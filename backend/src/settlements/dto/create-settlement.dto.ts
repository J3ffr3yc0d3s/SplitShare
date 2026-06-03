import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSettlementDto {
  @IsString()
  to: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
