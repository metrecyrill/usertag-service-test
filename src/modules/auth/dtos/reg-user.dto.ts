import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsString, Matches, MaxLength, MinLength} from "class-validator";

export class RegUserDto {
  @ApiProperty({ example: 'test@test.ru', description: 'User email' })
  @IsEmail({}, {message: 'Not a email'})
  @IsString()
  readonly email: string;

  @ApiProperty({ example: '1Aa03Lk*2', description: 'User\'s password' })
  @MinLength(8,  {message: 'Password\'s min length is 8'})
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'Password is too weak'})
  @IsString()
  readonly password: string;

  @ApiProperty({ example: 'Nick', description: 'User\'s nickname' })
  @MinLength(3,  {message: 'Nickname\'s min length is 3'})
  @MaxLength(30, {message: 'Nickname\'s max Length is 30'})
  @IsString()
  readonly nickname: string;
}
