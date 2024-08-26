import { Body, Controller, Headers, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('认证')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('login')
  @ApiOperation({ summary: '登录' })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('logout')
  @ApiOperation({ summary: '登出' })
  async logout(@Headers('Authorization') authorization: string) {
    return await this.authService.logout(authorization);
  }
}