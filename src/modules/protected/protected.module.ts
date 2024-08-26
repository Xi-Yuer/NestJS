import { Module } from '@nestjs/common';
import { AuthGuardInject } from '../../inject/auth.guard.inject';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [SessionModule],
  providers: [AuthGuardInject],
  exports: [AuthGuardInject]
})
export class ProtectedModule {
}
