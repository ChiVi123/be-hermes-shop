import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendMailDto {
  @IsEmail()
  @IsNotEmpty()
  toMail: string;
}
