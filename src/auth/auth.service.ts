import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResendMailDto } from '~/auth/dto/resend-mail.dto';
import { CreateUserDto } from '~/modules/users/dto/create-user.dto';
import { UserDocument } from '~/modules/users/entities/user.entity';
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

  signIn(user: UserDocument): { accessToken: string } {
    const payload = { sub: user._id, username: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  register(createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  resendMail(resendMailDto: ResendMailDto) {
    return this.usersService.resendMail(resendMailDto.toMail);
  }

  verify(id: string, codeId: string) {
    return this.usersService.verify(id, codeId);
  }
}
