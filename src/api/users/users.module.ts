import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user';
import { SessionModule } from '../../modules/session/session.module';
import { ErrorService } from 'src/services/error.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), SessionModule],
  controllers: [UsersController],
  providers: [UsersService, ErrorService],
  exports: [UsersService],
})
export class UsersModule {}
