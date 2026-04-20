import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/User.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Register entity in this module scope
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Export so AppModule or other modules can use it if needed
})
export class UsersModule {}