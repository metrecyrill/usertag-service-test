import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsOptional, IsString, MaxLength, MinLength} from "class-validator";

export class UpdateTagDto {
  @ApiProperty({ example: 'Apple', description: 'Tag name' })
  @IsOptional()
  @IsString()
  @MinLength(3,  {message: 'Min length is 3'})
  @MaxLength(40, {message: 'Max Length is 40'})
  readonly name?: string;

  @ApiProperty({ example: 1, description: 'Sort order', default: 0 })
  @IsOptional()
  @IsNumber()
  readonly sortOrder?: number;

}