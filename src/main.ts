import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '~/app.module';
import { getPropertyConfig } from '~/utils/configService';
import { envConfig } from '~/utils/constants';
import { LoggerFactory } from '~/utils/logger';

const logger = new Logger('bootstrap');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: LoggerFactory('Nest'),
  });
  const configService = app.get(envConfig);
  const port = getPropertyConfig(configService, 'PORT');
  const apiVersion = getPropertyConfig(configService, 'API_VERSION');

  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false }));
  app.setGlobalPrefix(apiVersion ?? 'api/v1', { exclude: [{ path: '', method: RequestMethod.GET }] });
  await app.listen(port ?? 8080);

  logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().catch((err) => {
  logger.error('Error during bootstrap:', err);
});
