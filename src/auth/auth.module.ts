import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '~/auth/auth.controller';
import { AuthService } from '~/auth/auth.service';
import { JwtStrategy } from '~/auth/passport/jwt.strategy';
import { LocalStrategy } from '~/auth/passport/local.strategy';
import { UsersModule } from '~/modules/users/users.module';
import { getPropertyConfig } from '~/utils/configService';
import { EnvConfig, envConfig } from '~/utils/constants';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      useFactory: (config: EnvConfig) => ({
        global: true,
        secret: getPropertyConfig(config, 'ACCESS_TOKEN_SECRET_SIGNATURE'),
        signOptions: {
          expiresIn: getPropertyConfig(config, 'ACCESS_TOKEN_LIFE'),
        },
      }),
      inject: [envConfig],
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
