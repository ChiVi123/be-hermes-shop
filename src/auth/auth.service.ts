import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto } from '~/auth/dto/change-password';
import { RetryActiveDto } from '~/auth/dto/retry-active.dto';
import { RetryPasswordDto } from '~/auth/dto/retry-password.dto';
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

  retryActive(retryActiveDto: RetryActiveDto) {
    return this.usersService.retryActive(retryActiveDto.toMail);
  }

  verify(userId: string, codeId: string) {
    return this.usersService.verify(userId, codeId);
  }

  retryPassword(retryPasswordDto: RetryPasswordDto) {
    return this.usersService.retryPassword(retryPasswordDto.toMail);
  }

  changePassword(changePasswordDto: ChangePasswordDto) {
    return this.usersService.changePassword(changePasswordDto);
  }
}
