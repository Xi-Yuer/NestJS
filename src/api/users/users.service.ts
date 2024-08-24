import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseService } from '../../inject/response.inject';
import { User } from '../../entities/user';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly responseService: ResponseService,
    @InjectRedis() private readonly redis: Redis,
    private readonly configService: ConfigService,
  ) {
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    try {
      await this.userRepository.save(user);
      return this.responseService.createSuccessResponse(null, '创建成功');
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    const cachedUser = await this.redis.get(id);
    if (cachedUser) {
      return JSON.parse(cachedUser);
    }
    const user = await this.userRepository.findOneBy({ id });
    if (user) {
      await this.redis.set(id, JSON.stringify(user), 'EX', this.configService.get('CACHE_TTL'));
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.findOne(id).then(async (user) => {
      if (user) {
        Object.assign(user, updateUserDto);
        await this.userRepository.save(user);
        return this.responseService.createSuccessResponse(null, '更新成功');
      } else {
        throw new HttpException('用户不存在', 400);
      }
    });
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
