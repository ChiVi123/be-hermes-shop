import { Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { Environment } from '~/config/environment.class';

const logger = new Logger('ConfigValidation');

export function validateEnvironment(config: Record<string, unknown>): Environment {
  const validatedConfig = plainToInstance(
    Environment,
    config,
    { enableImplicitConversion: true }, // Important for type conversion
  );

  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    logger.error('Configuration validation errors:');
    errors.forEach((error) => logger.error(error.toString()));
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
