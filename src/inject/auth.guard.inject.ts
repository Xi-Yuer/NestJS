import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthServiceInject } from './auth.service.inject';

@Injectable()
export class AuthGuardInject implements CanActivate {
  constructor(private readonly authService: AuthServiceInject) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const sessionId = request.headers['authorization'];
    if (!sessionId) {
      throw new UnauthorizedException('Invalid session');
    }

    const user = await this.authService.validateSession(sessionId);
    if (!user) {
      throw new UnauthorizedException('Session expired');
    }

    request.user = user; // 将用户信息附加到请求对象
    return true;
  }
}
