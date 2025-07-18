import { ConfigService } from '@nestjs/config';

interface Environment {
  PORT: number;
  NODE_ENV: 'production' | 'development' | 'debug' | 'test';
  API_VERSION: `api/v${number}`;
  MONGO_URI: string;
}

export const envConfig = ConfigService<Environment>;
export type EnvConfig = ConfigService<Environment>;
