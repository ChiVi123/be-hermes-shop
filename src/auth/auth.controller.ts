import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { Document, Types } from 'mongoose';
import { AuthService } from '~/auth/auth.service';
import { LocalAuthGuard } from '~/auth/passport/local-auth.guard';
import { Public } from '~/decorators/public';
import { CreateUserDto } from '~/modules/users/dto/create-user.dto';
import { User } from '~/modules/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  signIn(@Request() req: { user: Document<unknown, object, User, object> & User & { _id: Types.ObjectId } }) {
    return this.authService.signIn(req.user);
  }

  @Public()
  @Post('register')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
}
