import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '~/app.module';
import { Environment } from '~/config/environment.class';
import { DebugValidationPipe } from '~/core/debug-validation.pipe';
import { LoggerFactory } from '~/utils/logger';
import { isDebug } from '~/utils/mode-env';
import { globalValidationErrorFactory } from '~/utils/validation-error';

const logger = new Logger('bootstrap');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: LoggerFactory('Nest'),
  });

  const configService = app.get(ConfigService<Environment, true>);
  const port = configService.get('PORT', { infer: true });
  const apiVersion = configService.get('API_VERSION', { infer: true });
  const validationPipe = isDebug(configService)
    ? new DebugValidationPipe() // Breakpoint for debugging file src/debug/debug-validation.pipe.ts
    : new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        exceptionFactory: globalValidationErrorFactory,
      });

  app.enableShutdownHooks();
  app.useGlobalPipes(validationPipe);
  app.setGlobalPrefix(apiVersion, { exclude: [{ path: '', method: RequestMethod.GET }] });

  await app.listen(port);

  logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().catch((err) => {
  logger.error('Error during bootstrap:', err);
});
