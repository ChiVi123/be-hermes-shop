import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '~/app.module';
import { getPropertyConfig } from '~/utils/configService';
import { envConfig } from '~/utils/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(envConfig);
  const port = getPropertyConfig(configService, 'PORT');
  const apiVersion = getPropertyConfig(configService, 'API_VERSION');
  const logger = new Logger(bootstrap.name);

  app.enableShutdownHooks();
  app.setGlobalPrefix(apiVersion ?? 'v1');
  await app.listen(port ?? 8080);

  logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().catch((err) => {
  const logger = new Logger(bootstrap.name);
  logger.error('Error during bootstrap:', err);
});
