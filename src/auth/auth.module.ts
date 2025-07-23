import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '~/auth/auth.controller';
import { AuthService } from '~/auth/auth.service';
import { JwtStrategy } from '~/auth/passport/jwt.strategy';
import { LocalStrategy } from '~/auth/passport/local.strategy';
import { Environment } from '~/config/environment.class';
import { UsersModule } from '~/modules/users/users.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService<Environment, true>) => ({
        global: true,
        secret: config.get('ACCESS_TOKEN_SECRET_SIGNATURE', { infer: true }),
        signOptions: {
          expiresIn: config.get('ACCESS_TOKEN_LIFE', { infer: true }),
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
