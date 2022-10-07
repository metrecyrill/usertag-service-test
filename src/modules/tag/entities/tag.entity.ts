import {ApiProperty} from "@nestjs/swagger";

export class TagEntity {
  @ApiProperty({ example: 1, description: 'Tag id' })
  id: number;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'User uuid' })
  creator: string;

  @ApiProperty({ example: 'Test tag', description: 'Tag name' })
  name: string;

  @ApiProperty({ example: 1, description: 'tag order', default: 0 })
  sort_order: string;
}