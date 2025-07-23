import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Document, Types } from 'mongoose';
import { CreateUserDto } from '~/modules/users/dto/create-user.dto';
import { User } from '~/modules/users/entities/user.entity';
import { UsersService } from '~/modules/users/users.service';
import { comparePassword } from '~/utils/hash';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return null;
    }

    return user;
  }

  signIn(user: Document<unknown, object, User, object> & User & { _id: Types.ObjectId }): { accessToken: string } {
    const payload = { sub: user._id, username: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  register(createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }
}
