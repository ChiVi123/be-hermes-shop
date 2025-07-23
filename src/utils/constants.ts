import { ConfigService } from '@nestjs/config';
import dayjs from 'dayjs';

export interface Environment {
  PORT: number;
  NODE_ENV: 'production' | 'development' | 'debug' | 'test';
  API_VERSION: `api/v${number}`;
  // MongoDB
  MONGO_URI: string;
  // JWT
  ACCESS_TOKEN_SECRET_SIGNATURE: string;
  ACCESS_TOKEN_LIFE: string;
  REFRESH_TOKEN_SECRET_SIGNATURE: string;
  REFRESH_TOKEN_LIFE: string;
  // Verify Account
  VERIFY_ACCOUNT_EXPIRE_TIME: number;
  VERIFY_ACCOUNT_EXPIRE_UNIT: dayjs.ManipulateType;
  // Mail
  MAIL_SERVICE: string;
  MAIL_HOST: string;
  MAIL_PORT: number;
  MAIL_USER: string;
  MAIL_PASSWORD: string;
}

export const envConfig = ConfigService<Environment>;
export type EnvConfig = ConfigService<Environment>;
