import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

@Entity('users') // 指定表名为 'users'
@Unique(['email']) // 确保 email 唯一
@Unique(['username']) // 确保 username 唯一
export class User {
  @PrimaryGeneratedColumn('increment', {
    type: 'int',
    name: 'id',
    comment: '用户ID',
  })
  id: number;

  @Column({ length: 50 })
  @IsNotEmpty({ message: '用户名不能为空' })
  @Length(3, 50, { message: '用户名必须介于 3 到 50 个字符之间' })
  username: string;

  @Column({ select: false }) // 防止密码被默认查询出来
  @IsNotEmpty({ message: '密码不能为空' })
  @Length(8, 100, { message: '密码必须介于 8 到 100 个字符之间' })
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/, {
    message: '密码必须包含大写字母、小写字母、数字和特殊字符',
  })
  password: string;

  @Column()
  @IsEmail({}, { message: '请输入有效的电子邮件地址' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  @Column({ length: 15, nullable: true })
  @Index() // 为手机号创建索引
  phoneNumber: string;

  @Column({ nullable: true })
  nickName: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @Column({ type: 'enum', enum: ['male', 'female', 'other'], default: 'other' })
  gender: 'male' | 'female' | 'other';

  @Column({ type: 'json', nullable: true })
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date;
}
