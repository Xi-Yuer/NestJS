import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthServiceInject } from 'src/inject/auth.service.inject';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly sessionService: AuthServiceInject,
    private readonly usersService: UsersService,
  ) {
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findUserByUserName(loginDto.username);
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }
    return await this.sessionService.createSession(user.id, user);
  }
}
