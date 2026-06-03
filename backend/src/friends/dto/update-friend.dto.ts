import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateFriendDto {
  @IsOptional()
  @IsString()
  @IsIn(['pending', 'accepted', 'rejected'])
  status?: string;
}
