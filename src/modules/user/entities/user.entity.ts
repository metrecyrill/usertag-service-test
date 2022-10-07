import {ApiProperty} from "@nestjs/swagger";

export class UserEntity {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'User uuid' })
  uid: string;

  @ApiProperty({ example: 'test@test.ru', description: 'User email' })
  email: string;

  @ApiProperty({ example: '12345678', description: 'User password' })
  password: string;

  @ApiProperty({ example: 'Nick', description: 'User nickname' })
  nickname: string;
}