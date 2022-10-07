import {ForbiddenException, forwardRef, HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {DatabaseTable} from "../../database/common/database.decorator";
import {DatabaseService} from "../../database/database.service";
import {TagEntity} from "../entities/tag.entity";
import {CreateTagDto, UpdateTagDto} from "../dtos";
import {InsertParams, QueryParams, UpdateParams} from "../../database/types";
import {QueryGetTagParams} from "../types";
import {UserService} from "../../user/user.service";
import {UserEntity} from "../../user/entities/user.entity";
import {Conditions} from "../../database/enums/condition.enum";
import {TagResponse, TagsResponse, TagsWithPagination, TagWithCreatorResponse} from "../responses";
import {ITagService} from "../interfaces/tag-service.interface";

@Injectable()
export class TagService implements ITagService {
  constructor(
    @DatabaseTable('tag')
    private databaseService: DatabaseService<TagEntity>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService
    ) {
  }

  async create(userId: string, createTagDto: CreateTagDto): Promise<TagResponse> {
    try {
      const insertParams: InsertParams<TagEntity> = {
        values: [{ ...createTagDto, creator: userId }]
      }
      const tag = await this.databaseService.insert(insertParams);
      delete tag.creator;

      return tag;
    } catch (error) {
      if (error?.constraint === 'tag_name_key') {
        throw new HttpException('Tag with this name is already exist', HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException('Something is goings wrong.', HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }

  private async getTagById(id: number): Promise<TagEntity> {
    return await this.databaseService.findOne({where: {id}});
  }

  async update(id: number, updateTagDto: UpdateTagDto, userId: string): Promise<TagWithCreatorResponse> {
    const tag = await this.getTagById(id);
    if (tag.creator !== userId) {
      throw new ForbiddenException({message: 'Access denied.'});
    }

    try {
      const updateParams: UpdateParams<TagEntity> = {
        values: { ...updateTagDto },
        where: { id }
      }

      const updatedTag = await this.databaseService.update(updateParams);
      const creator = await this.userService.getUserByUid(updatedTag.creator);

      return {
        creator: {
          nickname: creator.nickname,
          uid: creator.uid
        },
        name: updatedTag.name,
        sort_order: updatedTag.sort_order
      };

    } catch (error) {
      if (error?.constraint === 'tag_name_key') {
        throw new HttpException('Tag with this name is already exist', HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException('Something is goings wrong.', HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }

  async delete(tagId: number, userId: string): Promise<TagEntity[]> {
    const tag = await this.getTagById(tagId);

    if (tag.creator !== userId) {
      throw new ForbiddenException({message: 'Access denied.'});
    }

    return await this.databaseService.delete({ where: {id: tag.id} });
  }

  async getTag(id: number): Promise<TagWithCreatorResponse> {
    const tag = await this.getTagById(id);
    const creator = await this.userService.getUserByUid(tag.creator);

    return {
      creator: {
        nickname: creator.nickname,
        uid: creator.uid
      },
      name: tag.name,
      sort_order: tag.sort_order
    };
  }

  async getTagsByUser(userId: UserEntity['uid']): Promise<TagsResponse> {
    const tags = await this.databaseService.findMany({
      where: {creator: userId},
      select: ["id", "name", "sort_order"]
    });

    return { tags }
  }

  async getTagsById(tags: Array<TagEntity['id']>): Promise<TagEntity[]> {
    return await this.databaseService.findMany({where: {id: tags}, select: ["id", "name", "sort_order"]});
  }

  async getTagsWithCreator(query: QueryGetTagParams): Promise<TagsWithPagination> {
    const {sortByOrder, sortByName, page, pageSize} = query;

    const queryParams: QueryParams<TagEntity> = {
      limit: pageSize,
      offset: page,
      orderBy: {},
      join: {
        table: 'user',
        alias: 'u',
        on: {
          main: "creator",
          join: "uid",
          condition: Conditions.EQUAL
        },
        select: ["nickname", "uid"]
      },
      select: ['*']
    };

    if (sortByOrder !== undefined) {
      queryParams.orderBy.sort_order = (sortByOrder === '') ? 'ASC' : 'DESC';
    }
    if (sortByName !== undefined) {
      queryParams.orderBy.name = (sortByName === '') ? 'ASC' : 'DESC';
    }

    const tags = await this.databaseService.findMany(queryParams) as UserEntity[] | TagEntity[];
    const quantity = await this.databaseService.count();

    return {
      data: tags.map(tag => {
        return {
          creator: {
            nickname: tag.nickname,
            uid: tag.uid,
          },
          name: tag.name,
          sort_order: tag.sort_order
        }
      }),
      meta: {
        pageSize,
        page,
        quantity
      }
    };
  }
}
