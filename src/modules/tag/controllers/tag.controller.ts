import {Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards} from "@nestjs/common";
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {TagService} from "../services/tag.service";
import {AccessTokenGuard} from "../../auth/guards";
import {TagEntity} from "../entities/tag.entity";
import {GetUserId} from "../../auth/decorators";
import {CreateTagDto, UpdateTagDto} from "../dtos";
import {QueryGetTagParams} from "../types";
import {TagResponse, TagsWithPagination, TagWithCreatorResponse} from "../responses";

@ApiTags('Tag')
@Controller('api')
@ApiBearerAuth()
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Create new tag' })
  @ApiResponse({ status: 201, type: [TagResponse] })
  @Post('/tag')
  async createTag(@GetUserId() userId: string, @Body() dto: CreateTagDto): Promise<TagResponse> {
    return await this.tagService.create(userId, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/tag')
  @ApiOperation({ summary: 'Get tags' })
  @ApiResponse({ status: 200, type: [TagsWithPagination] })
  async getTags(@Query() query: QueryGetTagParams): Promise<TagsWithPagination> {
    return await this.tagService.getTagsWithCreator(query);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/tag/:id')
  @ApiOperation({ summary: 'Get tag by id' })
  @ApiResponse({ status: 200, type: [TagWithCreatorResponse] })
  async getTag(@Param('id') id: number): Promise<TagWithCreatorResponse> {
    return await this.tagService.getTag(id);
  }

  @UseGuards(AccessTokenGuard)
  @Put('/tag/:id')
  @ApiOperation({ summary: 'Edit tag by id' })
  @ApiResponse({ status: 200, type: [TagWithCreatorResponse] })
  async updateUser(@Param('id') id: number, @Body() dto: UpdateTagDto, @GetUserId() userId: string): Promise<TagWithCreatorResponse> {
    return await this.tagService.update(id, dto, userId);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/tag/:id')
  @ApiOperation({ summary: 'Delete tag by id' })
  @ApiResponse({ status: 200 })
  async deleteUser(@Param('id') id: number, @GetUserId() userId: string): Promise<TagEntity[]> {
    return await this.tagService.delete(id, userId);
  }
}
