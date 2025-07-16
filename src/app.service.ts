import { Injectable, Logger, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService implements OnModuleInit, OnApplicationShutdown {
  private readonly logger = new Logger(AppService.name, { timestamp: true });

  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
    }
    this.logger.log('✅ Database connected');
  }

  async onApplicationShutdown(signal: string) {
    this.logger.warn(`⚠️ Shutdown signal received: ${signal}`);
    if (this.dataSource.isInitialized) {
      await this.dataSource.destroy();
      this.logger.log('🛑 Database connection closed');
    }
  }
}
