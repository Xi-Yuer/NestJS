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
import { QueryUserDto } from './dto/query-user.dto';

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

  async findAll(queryUserDto: QueryUserDto) {
    const { limit, pageSize, ...query } = queryUserDto;

    const [list, count] = await this.userRepository.findAndCount({
      where: {
        ...query,
      },
      take: limit,
      skip: (pageSize - 1) * limit,
    });
    return this.responseService.createSuccessResponse({ list, count }, '查询成功');
  }

  async findOne(id: string) {
    const cachedUser = await this.redis.get(id);
    if (cachedUser) {
      return this.responseService.createSuccessResponse(JSON.parse(cachedUser), '查询成功');
    }
    const user = await this.userRepository.findOneBy({ id });
    if (user) {
      await this.redis.set(id, JSON.stringify(user), 'EX', this.configService.get('CACHE_TTL'));
    }
    return this.responseService.createSuccessResponse(user, '查询成功');
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.findOne(id).then(async (user) => {
      if (user.data) {
        await this.userRepository.update(id, updateUserDto);
        await this.redis.del(id);
        return this.responseService.createSuccessResponse(null, '更新成功');
      } else {
        throw new HttpException('用户不存在', 400);
      }
    });
  }

  async remove(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException('用户不存在', 400);
    }
    await this.userRepository.delete(id);
    await this.redis.del(id);
    return this.responseService.createSuccessResponse(null, '删除成功');
  }
}
