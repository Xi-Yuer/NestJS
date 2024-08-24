import { NestFactory } from '@nestjs/core';
import { RootModule } from './root.module';
import 'reflect-metadata';
import { useGlobalApp } from './global/useGlobalApp';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);
  useGlobalApp(app);
  await app.listen(3000);
}

bootstrap().then(() => {
  console.log('服务器启动成功: http://localhost:3000');
  console.log('接口文档地址: http://localhost:3000/api');
});
