import { ConfigService } from '@nestjs/config';

export interface Environment {
  PORT: number;
  NODE_ENV: 'production' | 'development' | 'debug' | 'test';
  API_VERSION: `v${number}`;
  MONGO_URL: string;
  MONGO_DATABASE: string;
}

export const envConfig = ConfigService<Environment>;
