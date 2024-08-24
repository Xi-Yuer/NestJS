import { setUpSwagger } from '../common/swagger/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';

export function useGlobalApp(app: INestApplication) {
  setUpSwagger(app);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,              // 自动删除请求对象中不在 DTO 中定义的属性
    forbidNonWhitelisted: true,   // 如果请求对象中包含未在 DTO 中定义的属性，则抛出异常
    transform: true,              // 自动将请求对象中的属性转换为 DTO 中定义的类型
  }));
}