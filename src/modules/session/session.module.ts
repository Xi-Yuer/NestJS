import { Module } from '@nestjs/common';
import { AuthServiceInject } from '../../inject/auth.service.inject';

@Module({
  providers: [AuthServiceInject],
  exports: [AuthServiceInject],
})
export class SessionModule {}
