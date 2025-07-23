import { MailerService } from '@nestjs-modules/mailer';
import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { Document, Types } from 'mongoose';
import { AuthService } from '~/auth/auth.service';
import { LocalAuthGuard } from '~/auth/passport/local-auth.guard';
import { Public } from '~/decorators/public';
import { CreateUserDto } from '~/modules/users/dto/create-user.dto';
import { User } from '~/modules/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  @Public()
  @Get('mail')
  mailTest() {
    this.mailerService
      .sendMail({
        to: 'admin210725@gmail.com', // list of receivers
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        template: 'register.hbs', // HTML body content
        context: {
          name: 'Test',
          activationCode: '123456',
        },
      })
      .then(() => {})
      .catch(() => {});

    return { message: 'Mail test endpoint' };
  }

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

  @Public()
  @Post('verify')
  verify(@Body('email') email: string, @Body('codeId') codeId: string) {
    return this.authService.verify(email, codeId);
  }
}
