import {ApiProperty} from "@nestjs/swagger";

export class UserTagEntity {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'User id' })
  user_id: string;

  @ApiProperty({ example: 2, description: 'Tag id' })
  tag_id: number;
}