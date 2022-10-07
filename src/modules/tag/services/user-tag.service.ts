import {Injectable} from '@nestjs/common';
import {DatabaseService} from "../../database/database.service";
import {DatabaseTable} from "../../database/common/database.decorator";
import {UserTagEntity} from "../entities/user-tag.entity";
import {AddTagsDto} from "../dtos/add-tags.dto";
import {InsertParams} from "../../database/types";
import {UserEntity} from "../../user/entities/user.entity";
import {TagsResponse} from "../responses";
import {TagService} from "./tag.service";
import {IUserTagService} from "../interfaces/user-tag-service.interface";

@Injectable()
export class UserTagService implements IUserTagService {
  constructor(
    @DatabaseTable('userTag')
    private databaseService: DatabaseService<UserTagEntity>,
    private tagService: TagService
  ) {
  }

  async deleteTag(userId: UserEntity["uid"], id: number): Promise<TagsResponse> {
    await this.databaseService.delete({ where: {user_id: userId, tag_id: id} });

    return this.getTags(userId);
  }

  async addTags(userId: string, addTagsDto: AddTagsDto): Promise<TagsResponse> {
    const insertParams: InsertParams<UserTagEntity> = {
      values: addTagsDto.tags.map((tag)=> {
        return {
          user_id: userId,
          tag_id: tag
        }
      })
    };
    await this.databaseService.insertMany(insertParams);

    return this.getTags(userId);
  }

  private async getTags(userId: UserEntity["uid"]): Promise<TagsResponse> {
    const userTags = await this.databaseService.findMany({ where: {user_id: userId} });
    const tagIds = userTags.map(userTag => userTag.tag_id);
    const tags = await this.tagService.getTagsById(tagIds);

    return { tags };
  }
}
