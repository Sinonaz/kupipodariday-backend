import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { OwnershipGuard } from '@/auth/guards/ownership.guard';

@Module({
  exports: [UsersService],
  imports: [TypeOrmModule.forFeature([User]), ConfigModule.forRoot()],
  controllers: [UsersController],
  providers: [UsersService, JwtAuthGuard, OwnershipGuard],
})
export class UsersModule {}
