import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  // TODO: validate password not just check type string, use regex
  @IsString()
  @IsNotEmpty()
  password: string;
}
