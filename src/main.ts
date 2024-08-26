import { NestFactory } from '@nestjs/core';
import { RootModule } from './modules/root/root.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import 'reflect-metadata';
import { useInitial } from './initial/useInitial';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  useInitial(app);

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);

  logger.log(`服务器启动成功: http://localhost:${port}`);
  logger.log(`接口文档地址: http://localhost:${port}/api`);
}

bootstrap().catch((error) => {
  console.error('启动失败:', error);
  process.exit(1);
});