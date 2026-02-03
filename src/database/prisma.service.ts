import { DatabaseConfig } from '@config/database.config';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma'; 
import { PrismaPg } from '@prisma/adapter-pg'; 
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger(PrismaService.name);

  constructor(
    private readonly configService: ConfigService
  ) {

    const databaseConfig = configService.get<DatabaseConfig>('database');
    const connectionString = `postgresql://${databaseConfig?.username}:${databaseConfig?.password}@${databaseConfig?.host}:${databaseConfig?.port}/${databaseConfig?.database}`;

    const pool = new Pool({ 
        connectionString,
        max: databaseConfig?.connectionLimit || 10,
        idleTimeoutMillis: 60000, 
    });

    const adapter = new PrismaPg(pool);

    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
      ],
      adapter,
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to the database');
  }
}