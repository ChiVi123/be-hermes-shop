import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from '~/app.controller';
import { AppService } from '~/app.service';
import { UsersModule } from '~/modules/users/users.module';
import { getPropertyConfig } from '~/utils/configService';
import { envConfig, EnvConfig } from '~/utils/constants';

const logger = new Logger('onConnectionCreate', { timestamp: true });

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [envConfig],
      useFactory: (config: EnvConfig) => ({
        uri: getPropertyConfig(config, 'MONGO_URI'),
        onConnectionCreate(connection) {
          connection.on('connected', () => logger.log('Mongoose connected'));
          connection.on('open', () => logger.log('Mongoose open'));
          connection.on('disconnected', () => logger.warn('Mongoose disconnected'));
          connection.on('reconnected', () => logger.warn('Mongoose reconnected'));
          connection.on('disconnecting', () => logger.warn('Mongoose disconnecting'));
          return connection;
        },
      }),
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
