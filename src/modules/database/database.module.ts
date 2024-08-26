import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { EnvironmentModule } from '../environment/environment.module';
import { User } from '../../entities/user';

@Module({
  imports: [
    EnvironmentModule, // 导入 EnvironmentModule 以使用环境变量
    TypeOrmModule.forRootAsync({
      imports: [EnvironmentModule],
      // configService 之所以能够使用到环境变量，是因为我们在该模块中导入了环境变量模块
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [User],
        logging: ['query', 'error'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {
}
