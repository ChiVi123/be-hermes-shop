import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from '~/app.service';
import { UsersModule } from '~/modules/users/users.module';
import { getPropertyConfig } from '~/utils/configService';
import { Environment } from '~/utils/constants';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService<Environment>],
      useFactory: (config: ConfigService<Environment>) => ({
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
