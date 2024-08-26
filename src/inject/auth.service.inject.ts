import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class AuthService {
  constructor(
    @InjectRedis() private readonly redis: Redis) {
  }

  async createSession(id: string, userInfo: object): Promise<string> {
    const sessionId = this.generateSessionId(id);
    await this.redis.set(sessionId, JSON.stringify(userInfo), 'EX', 1800); // 30分钟过期时间
    return sessionId;
  }

  async validateSession(sessionId: string): Promise<any> {
    const data = await this.redis.get(sessionId);
    if (data) {
      await this.redis.expire(sessionId, 1800); // 重置过期时间
      return JSON.parse(data);
    }
    return null;
  }

  async destroySession(sessionId: string): Promise<void> {
    await this.redis.del(sessionId);
  }

  private generateSessionId(userId: string): string {
    return `${userId}-${Date.now()}`; // 使用用户ID和当前时间戳生成会话ID
  }
}