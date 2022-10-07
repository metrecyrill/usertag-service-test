import {ApiProperty} from "@nestjs/swagger";
import {IsArray} from "class-validator";

export class AddTagsDto {
  @ApiProperty({ example: [1, 2, 3], description: 'Array of tags' })
  @IsArray()
  readonly tags: number[];
}