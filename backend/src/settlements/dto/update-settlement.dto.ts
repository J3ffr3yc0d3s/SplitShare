import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateSettlementDto {
  @IsOptional()
  @IsString()
  @IsIn(['pending', 'completed'])
  status?: string;
}
