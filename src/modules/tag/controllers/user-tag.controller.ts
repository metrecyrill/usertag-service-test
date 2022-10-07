import {Body, Controller, Delete, Param, Post, UseGuards} from '@nestjs/common';
import {UserTagService} from "../services/user-tag.service";
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {GetUserId} from "../../auth/decorators";
import {AccessTokenGuard} from "../../auth/guards";
import {AddTagsDto} from "../dtos/add-tags.dto";
import {TagsResponse} from "../responses";

@ApiTags('User tags')
@Controller('api/user/tag')
@ApiBearerAuth()
export class UserTagController {
  constructor(private readonly userTagService: UserTagService) {}

  @UseGuards(AccessTokenGuard)
  @Post('/')
  @ApiOperation({ summary: 'Add tags for user' })
  @ApiResponse({ status: 200, type: [TagsResponse] })
  async addTags(@GetUserId() userId: string, @Body() addTagsDto: AddTagsDto): Promise<TagsResponse> {
    return await this.userTagService.addTags(userId, addTagsDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:id')
  @ApiOperation({ summary: 'Delete from user tag by id' })
  @ApiResponse({ status: 200, type: [TagsResponse] })
  async deleteTag(@GetUserId() userId: string, @Param('id') id: number): Promise<TagsResponse> {
    return await this.userTagService.deleteTag(userId, id);
  }
}
