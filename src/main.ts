import { NestFactory } from '@nestjs/core';
import { RootModule } from './modules/root/root.module';
import { ConfigService } from '@nestjs/config';
import 'reflect-metadata';
import { useInitial } from './initial/useInitial';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);
  const configService = app.get(ConfigService);

  useInitial(app);

  return await app.listen(configService.get<number>('PORT' as any) || 3000);
}

bootstrap().then();
