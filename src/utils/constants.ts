import { ConfigService } from '@nestjs/config';

export interface Environment {
  PORT: number;
  NODE_ENV: 'production' | 'development' | 'debug' | 'test';
  API_VERSION: `api/v${number}`;
  MONGO_URI: string;
  ACCESS_TOKEN_SECRET_SIGNATURE: string;
  ACCESS_TOKEN_LIFE: string;
  REFRESH_TOKEN_SECRET_SIGNATURE: string;
  REFRESH_TOKEN_LIFE: string;
}

export const envConfig = ConfigService<Environment>;
export type EnvConfig = ConfigService<Environment>;
