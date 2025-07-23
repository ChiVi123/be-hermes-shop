import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '~/app.module';
import { Environment } from '~/config/environment.class';
import { LoggerFactory } from '~/utils/logger';

const logger = new Logger('bootstrap');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: LoggerFactory('Nest'),
  });
  const configService = app.get(ConfigService<Environment, true>);
  const port = configService.get('PORT', { infer: true });
  const apiVersion = configService.get('API_VERSION', { infer: true });

  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false }));
  app.setGlobalPrefix(apiVersion, { exclude: [{ path: '', method: RequestMethod.GET }] });
  await app.listen(port ?? 8080);

  logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().catch((err) => {
  logger.error('Error during bootstrap:', err);
});
