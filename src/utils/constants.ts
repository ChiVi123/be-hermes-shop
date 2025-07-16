import { ConfigService } from '@nestjs/config';

export interface Environment {
  PORT: number;
  NODE_ENV: 'production' | 'development' | 'debug' | 'test';
  API_VERSION: `v${number}`;
  MONGO_URL: string;
}

export const envConfig = ConfigService<Environment>;
