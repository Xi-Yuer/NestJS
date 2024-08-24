import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, Length, Matches, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class AddressDto {
  @ApiProperty()
  @IsNotEmpty({ message: '街道地址不能为空' })
  street: string;

  @ApiProperty()
  @IsNotEmpty({ message: '城市不能为空' })
  city: string;

  @ApiProperty()
  @IsNotEmpty({ message: '州/省不能为空' })
  state: string;

  @ApiProperty()
  @IsNotEmpty({ message: '邮政编码不能为空' })
  zipCode: string;
}

export class CreateUserDto {
  @ApiProperty({
    description: '用户名必须是唯一的',
    example: 'john_doe',
    maxLength: 50,
    minLength: 3,
    pattern: '^[a-zA-Z0-9_]{3,50}$',
  })
  @IsNotEmpty({ message: '用户名不能为空' })
  @Length(3, 50, { message: '用户名必须介于 3 到 50 个字符之间' })
  username: string;

  @ApiProperty({
    description: '密码必须是至少 8 个字符，包含大写字母、小写字母、数字和特殊字符',
    example: 'Password123!',
    maxLength: 100,
    minLength: 8,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
  })
  @IsNotEmpty({ message: '密码不能为空' })
  @Length(8, 100, { message: '密码必须介于 8 到 100 个字符之间' })
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/, {
    message: '密码必须包含大写字母、小写字母、数字和特殊字符',
  })
  password: string;

  @ApiProperty(
    {
      description: '电子邮件必须是有效的电子邮件地址',
      example: 'example@example.com',
      maxLength: 50,
      minLength: 5,
    },
  )
  @IsEmail({}, { message: '请输入有效的电子邮件地址' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  @ApiProperty(
    {
      description: '手机号必须是有效的中国手机号',
      example: '13800138000',
      maxLength: 15,
      minLength: 11,
      pattern: '^1[3456789]\d{9}$',
    },
  )
  @IsOptional()
  @IsPhoneNumber('CN', { message: '请输入有效的手机号' })
  @Length(0, 15, { message: '手机号长度不能超过 15 个字符' })
  phoneNumber?: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 50, { message: '昵称长度不能超过 50 个字符' })
  nickName?: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString({}, { message: '生日必须是有效的日期格式' })
  birthDate?: string;

  @ApiProperty({
    description: '性别必须是 male, female, 或 other',
    enum: ['male', 'female', 'other'],
  })
  @IsEnum(['male', 'female', 'other'], { message: '性别必须是 male, female, 或 other' })
  @IsOptional()
  gender?: 'male' | 'female' | 'other';

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;
}