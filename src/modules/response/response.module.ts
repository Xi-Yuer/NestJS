import { Global, Module } from '@nestjs/common';
import { ResponseService } from '../../inject/response.inject';

@Global()
@Module({
  providers: [ResponseService],
  exports: [ResponseService],
})
export class ResponseModule {
}