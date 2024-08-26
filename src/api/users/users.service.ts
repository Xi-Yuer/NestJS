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
import { ErrorService } from '../../services/error.service';

@Injectable()
export class UsersService {
  private readonly redisKey = 'user:';

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly responseService: ResponseService,
    @InjectRedis() private readonly redis: Redis,
    private readonly configService: ConfigService,
    private readonly errorService: ErrorService,
  ) {
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);
      return this.responseService.createSuccessResponse(null, '创建成功');
    } catch (error) {
      throw this.errorService.handleError(error);
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
    return this.responseService.createSuccessResponse(
      { list, count },
      '查询成功',
    );
  }

  async findOne(id: number) {
    const cachedUser = await this.redis.get(this.redisKey + id);
    if (cachedUser) {
      return this.responseService.createSuccessResponse(
        JSON.parse(cachedUser),
        '查询成功',
      );
    }
    const user = await this.userRepository.findOneBy({ id });
    if (user) {
      await this.redis.set(
        this.redisKey + id,
        JSON.stringify(user),
        'EX',
        this.configService.get('CACHE_TTL'),
      );
    }
    return this.responseService.createSuccessResponse(user, '查询成功');
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.findOne(id).then(async (user) => {
      if (user.data) {
        await this.userRepository.update(id, updateUserDto);
        await this.redis.del(id.toString());
        return this.responseService.createSuccessResponse(null, '更新成功');
      } else {
        throw this.errorService.handleError(
          new HttpException('用户不存在', 400),
        );
      }
    });
  }

  async remove(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw this.errorService.handleError(new HttpException('用户不存在', 400));
    }
    await this.userRepository.delete(id);
    await this.redis.del(this.redisKey + id);
    return this.responseService.createSuccessResponse(null, '删除成功');
  }

  async findUserByUserName(username: string) {
    const user = await this.userRepository.findOneBy({ username });
    if (!user) {
      throw new HttpException('用户不存在', 400);
    }
    return user;
  }
}
