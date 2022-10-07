import {ApiProperty} from "@nestjs/swagger";

export class TokenResponse {
  @ApiProperty({ example: 'access.token', description: 'access token' })
  token: string;

  @ApiProperty({ example: '1800', description: 'expire time' })
  expire: string
}