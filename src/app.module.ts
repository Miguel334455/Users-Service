import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/User.entity';

@Module({
  imports: [
    // ─── Config (reads .env file) ──────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // ─── PostgreSQL via TypeORM ────────────────────────────────────────
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USERNAME', 'postgres'),
        password: config.get<string>('DB_PASSWORD', '1234'),
        database: config.get<string>('DB_NAME', 'users_db'),
        entities: [User],
        synchronize: config.get<string>('NODE_ENV') !== 'production', // Auto-create tables in dev
        logging: config.get<string>('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),

    // ─── Feature Modules ───────────────────────────────────────────────
    UsersModule,
  ],
})
export class AppModule {}