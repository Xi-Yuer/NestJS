// src/environment/environment.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 使 ConfigModule 成为全局模块
      envFilePath: '.env', // 指定环境变量文件路径
    }),
  ],
  exports: [ConfigModule],
})
export class EnvironmentModule {
}
