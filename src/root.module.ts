import { Module } from '@nestjs/common';
import { UsersModule } from './api/users/users.module';
import { DatabaseModule } from './common/database/database.module';
import { EnvironmentModule } from './common/environment/environment.module';
import { ResponseModule } from './modules/response/response.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';

@Module({
  imports: [
    // 工具类
    ResponseModule,
    // 数据库
    DatabaseModule,
    // 业务
    UsersModule,
    EnvironmentModule,
    ResponseModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class RootModule {
}
