import { ConfigService } from '@nestjs/config';
import { Environment } from '~/config/environment.class';

type CheckMode = (config: ConfigService<Environment, true>) => boolean;

export const isDebug: CheckMode = (config) => config.get('NODE_ENV', { infer: true }) === 'debug';
export const isDevelopment: CheckMode = (config) => config.get('NODE_ENV', { infer: true }) === 'development';
export const isProduction: CheckMode = (config) => config.get('NODE_ENV', { infer: true }) === 'production';
export const isTest: CheckMode = (config) => config.get('NODE_ENV', { infer: true }) === 'test';
