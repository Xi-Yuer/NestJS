import { IsBoolean, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly username: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly phoneNumber: string;

  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  readonly isActive: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: 'page 不能为空' })
  @Min(1, { message: 'page 不能小于 1' })
  @Max(500, { message: 'page 不能大于 500' })
  readonly pageSize: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'limit 不能为空' })
  @Min(1, { message: 'limit 不能小于 1' })
  @Max(500, { message: 'limit 不能大于 500' })
  readonly limit: number;
}