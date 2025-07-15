import { NestFactory } from '@nestjs/core';
import { AppModule } from '~/app.module';
import { getPropertyConfig } from '~/utils/configService';
import { envConfig } from '~/utils/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(envConfig);
  const port = getPropertyConfig(configService, 'PORT');

  app.setGlobalPrefix('v1');
  await app.listen(port ?? 8080);

  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
});
