import { NestFactory } from '@nestjs/core';
import { RootModule } from './modules/root/root.module';
import 'reflect-metadata';
import { useInitial } from './initial/useInitial';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);
  useInitial(app);
  await app.listen(3000);
}

bootstrap().then(() => {
  console.log('服务器启动成功: http://localhost:3000');
  console.log('接口文档地址: http://localhost:3000/api');
});
