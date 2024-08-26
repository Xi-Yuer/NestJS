import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SessionModule } from '../../modules/session/session.module';
import { AuthServiceInject } from 'src/inject/auth.service.inject';
import { UsersService } from '../users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user';
import { ErrorService } from 'src/services/error.service';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), SessionModule],
  controllers: [AuthController],
  providers: [AuthService, AuthServiceInject, UsersService, ErrorService],
})
export class AuthModule {}
