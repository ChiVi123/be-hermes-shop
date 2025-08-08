import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Match } from '~/decorators/match.decorator';

export class ChangePasswordDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  codeId: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @Match('password')
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
