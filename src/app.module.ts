import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from '~/app.service';
import { UsersModule } from '~/modules/users/users.module';
import { getPropertyConfig } from '~/utils/configService';
import { envConfig, EnvConfig } from '~/utils/constants';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [envConfig],
      useFactory: (config: EnvConfig) => ({
        type: 'mongodb',
        url: getPropertyConfig(config, 'MONGO_URL'),
        database: getPropertyConfig(config, 'MONGO_DATABASE'),
        synchronize: getPropertyConfig(config, 'NODE_ENV') === 'development',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
      }),
    }),
    UsersModule,
  ],
  providers: [AppService],
})
export class AppModule {}
