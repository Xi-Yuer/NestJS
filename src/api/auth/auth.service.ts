import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthServiceInject } from 'src/inject/auth.service.inject';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { ResponseService } from 'src/inject/response.inject';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class AuthService {
  constructor(
    private readonly sessionService: AuthServiceInject,
    private readonly usersService: UsersService,
    private readonly responseService: ResponseService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findUserByUserName(loginDto.username);
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }
    const session = await this.sessionService.createSession(user.id, user);
    return this.responseService.createSuccessResponse(session);
  }

  async logout(authorization: string) {
    await this.redis.del(authorization);
    return this.responseService.createSuccessResponse(null, '登出成功');
  }
}
