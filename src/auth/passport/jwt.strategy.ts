import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Environment } from '~/core/environment.class';

interface JwtPayload {
  sub: string;
  username: string;
  // add other properties if needed
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: ConfigService<Environment, true>) {
    const secret = config.get('ACCESS_TOKEN_SECRET_SIGNATURE', { infer: true });
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
