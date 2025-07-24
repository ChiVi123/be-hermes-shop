import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyAuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  codeId: string;
}
