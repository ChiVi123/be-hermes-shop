import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class VerifyAuthDto {
  // TODO: rename to userId
  @IsMongoId()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  codeId: string;
}
