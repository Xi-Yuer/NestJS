import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class AuthServiceInject {
  constructor(@InjectRedis() private readonly redis: Redis) {
  }

  async createSession(id: number, userInfo: object): Promise<string> {
    const sessionId = this.generateSessionId(id);
    await this.redis.set(sessionId, JSON.stringify(userInfo), 'EX', 1800); // 30分钟过期时间
    return sessionId;
  }

  async validateSession(sessionId: number): Promise<any> {
    const data = await this.redis.get(sessionId.toString());
    if (data) {
      await this.redis.expire(sessionId.toString(), 1800); // 重置过期时间
      return JSON.parse(data);
    }
    return null;
  }

  async destroySession(sessionId: number): Promise<void> {
    await this.redis.del(sessionId.toString());
  }

  private generateSessionId(userId: number): string {
    return `${userId}-${Date.now()}`; // 使用用户ID和当前时间戳生成会话ID
  }
}
