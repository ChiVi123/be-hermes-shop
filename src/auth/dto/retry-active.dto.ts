import { IsEmail, IsNotEmpty } from 'class-validator';

export class RetryActiveDto {
  @IsEmail()
  @IsNotEmpty()
  toMail: string;
}
