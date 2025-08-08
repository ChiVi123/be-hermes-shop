import { MailerService } from '@nestjs-modules/mailer';
import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '~/auth/auth.service';
import { ChangePasswordDto } from '~/auth/dto/change-password';
import { RetryActiveDto } from '~/auth/dto/retry-active.dto';
import { RetryPasswordDto } from '~/auth/dto/retry-password.dto';
import { VerifyAuthDto } from '~/auth/dto/verify-auth.dto';
import { LocalAuthGuard } from '~/auth/passport/local-auth.guard';
import { Public } from '~/decorators/public';
import { CreateUserDto } from '~/modules/users/dto/create-user.dto';
import { UserDocument } from '~/modules/users/entities/user.entity';

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
  signIn(@Request() req: { user: UserDocument }) {
    return this.authService.signIn(req.user);
  }

  @Public()
  @Post('register')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Public()
  @Post('retry-active')
  retryActive(@Body() retryActiveDto: RetryActiveDto) {
    return this.authService.retryActive(retryActiveDto);
  }

  @Public()
  @Post('verify')
  verify(@Body() verifyAuthDto: VerifyAuthDto) {
    return this.authService.verify(verifyAuthDto.userId, verifyAuthDto.codeId);
  }

  @Public()
  @Post('retry-password')
  retryPassword(@Body() retryPasswordDto: RetryPasswordDto) {
    return this.authService.retryPassword(retryPasswordDto);
  }

  @Public()
  @Post('change-password')
  changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(changePasswordDto);
  }
}
