import {ApiProperty} from "@nestjs/swagger";

export class TokensEntity {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'User uuid' })
  user_id: string;

  @ApiProperty({ example: 'token', description: 'User access token' })
  access_token: string;

  @ApiProperty({ example: 'token', description: 'User refresh token' })
  refresh_token: string;

  refresh_expire: Date;
}