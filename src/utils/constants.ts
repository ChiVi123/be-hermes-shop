import { ConfigService } from '@nestjs/config';

interface Environment {
  PORT: number;
}

export const envConfig = ConfigService<Environment>;
