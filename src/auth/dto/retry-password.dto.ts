import { IsEmail, IsNotEmpty } from 'class-validator';

export class RetryPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  toMail: string;
}
