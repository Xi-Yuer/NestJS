import { IsBoolean, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

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
  @Type(() => Number)
  @IsNotEmpty({ message: 'pageSize 不能为空' })
  @Min(1, { message: 'pageSize 不能小于 1' })
  @Max(500, { message: 'pageSize 不能大于 500' })
  readonly pageSize: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNotEmpty({ message: 'limit 不能为空' })
  @Min(1, { message: 'limit 不能小于 1' })
  @Max(500, { message: 'limit 不能大于 500' })
  readonly limit: number;
}