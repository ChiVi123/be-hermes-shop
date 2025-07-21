import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { getPropertyConfig } from '~/utils/configService';
import { Environment } from '~/utils/constants';

interface JwtPayload {
  sub: string;
  username: string;
  // add other properties if needed
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService<Environment>) {
    const secret = getPropertyConfig(configService, 'ACCESS_TOKEN_SECRET_SIGNATURE');
    if (!secret) {
      throw new Error('ACCESS_TOKEN_SECRET_SIGNATURE is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: JwtPayload) {
    return { _id: payload.sub, username: payload.username };
  }
}
