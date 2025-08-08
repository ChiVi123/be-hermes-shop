import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class VerifyAuthDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  codeId: string;
}
