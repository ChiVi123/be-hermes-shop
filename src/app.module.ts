import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { AppController } from '~/app.controller';
import { AppService } from '~/app.service';
import { AuthModule } from '~/auth/auth.module';
import { JwtAuthGuard } from '~/auth/passport/jwt-auth.guard';
import { Environment } from '~/config/environment.class';
import { validateEnvironment } from '~/config/validation.util';
import { UsersModule } from '~/modules/users/users.module';

const MAIL_PORT = 465;
const logger = new Logger('onConnectionCreate', { timestamp: true });

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnvironment }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<Environment, true>) => ({
        uri: config.get('MONGO_URI', { infer: true }),
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
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<Environment, true>) => ({
        transport: {
          service: config.get('MAIL_SERVICE', { infer: true }),
          host: config.get('MAIL_HOST', { infer: true }),
          port: config.get('MAIL_PORT', { infer: true }),
          secure: config.get('MAIL_PORT', { infer: true }) === MAIL_PORT, // true for 465, false for other ports
          auth: {
            user: config.get('MAIL_USER', { infer: true }),
            pass: config.get('MAIL_PASSWORD', { infer: true }),
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>',
        },
        // preview: true,
        template: {
          dir: join(__dirname, 'mail/templates'),
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
