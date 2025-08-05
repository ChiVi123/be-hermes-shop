import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class VerifyAuthDto {
  @IsMongoId()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  codeId: string;
}
