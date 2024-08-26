import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryUserDto } from './dto/query-user.dto';
import { AuthGuardInject } from '../../inject/auth.guard.inject';

@ApiTags('用户管理')
@Controller('users')
@UseGuards(AuthGuardInject)
@ApiHeader({
  name: 'authorization',
  description: '用户身份令牌',
  required: true,
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @Post()
  @ApiOperation({ summary: '创建用户' })
  @ApiBody({ type: CreateUserDto })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: '获取用户列表' })
  findAll(@Query() queryUserDto: QueryUserDto) {
    return this.usersService.findAll(queryUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个用户' })
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新用户' })
  @ApiBody({ type: UpdateUserDto })
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除用户' })
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
