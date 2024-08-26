import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../api/auth/auth.service';

@Injectable()
export class AuthGuardInject implements CanActivate {
  // constructor(private readonly authService: AuthService) {
  // }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const sessionId = request.headers['session-id'];
    if (!sessionId) {
      throw new UnauthorizedException('缺少会话ID');
    }

    // const user = await this.authService.validateSession(sessionId);
    // if (!user) {
    //   throw new UnauthorizedException('会话已过期');
    // }
    //
    // request.user = user; // 将用户信息附加到请求对象
    return true;
  }
}