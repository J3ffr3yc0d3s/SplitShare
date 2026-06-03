import { IsEmail, IsString, IsUUID, MinLength } from 'class-validator';

export class RegisterDto {
  @IsUUID()
  authId: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  name: string;
}
