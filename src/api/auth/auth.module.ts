import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SessionModule } from '../../modules/session/session.module';
import { AuthServiceInject } from 'src/inject/auth.service.inject';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [AuthController],
  providers: [AuthServiceInject, UsersService],
})
export class AuthModule {}
