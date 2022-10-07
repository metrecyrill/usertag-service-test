import {Body, Controller, Delete, Get, Put, UseGuards} from '@nestjs/common';
import {UserService} from "./user.service";
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {UpdateUserDto} from "./dtos";
import {GetUserId} from "../auth/decorators";
import {AccessTokenGuard} from "../auth/guards";
import {TagService} from "../tag/services/tag.service";
import {GetUserResponse} from "./responses";
import {TagsResponse} from "../tag/responses";
import {UserEntity} from "./entities/user.entity";

@ApiTags('User')
@Controller('api')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService,
              private readonly tagService: TagService) {}

  @UseGuards(AccessTokenGuard)
  @Get('/user')
  @ApiOperation({ summary: 'Get users' })
  @ApiResponse({ status: 200, type: [GetUserResponse] })
  async getUser(@GetUserId() userId: string): Promise<GetUserResponse> {
    return await this.userService.get(userId);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/user/my')
  @ApiOperation({ summary: 'Get tags, created by user' })
  @ApiResponse({ status: 200, type: [TagsResponse] })
  async getCreatedTagsByUser(@GetUserId() userId: string): Promise<TagsResponse> {
    return await this.tagService.getTagsByUser(userId);
  }

  @UseGuards(AccessTokenGuard)
  @Put('/user')
  @ApiOperation({ summary: 'Edit user' })
  @ApiResponse({ status: 200, type: [UpdateUserDto] })
  async updateUser(@GetUserId() userId: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(userId, updateUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/user')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200 })
  async deleteUser(@GetUserId() userId: string): Promise<UserEntity[]> {
    return await this.userService.delete(userId);
  }
}
