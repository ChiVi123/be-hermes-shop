import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { CreateUserDto } from '~/modules/users/dto/create-user.dto';

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['password'] as const)) {
  @IsMongoId()
  @IsNotEmpty()
  _id: string;
}
