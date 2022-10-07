import {CreateTagDto, UpdateTagDto} from "../dtos";
import {TagResponse, TagsResponse, TagsWithPagination, TagWithCreatorResponse} from "../responses";
import {TagEntity} from "../entities/tag.entity";
import {UserEntity} from "../../user/entities/user.entity";
import {QueryGetTagParams} from "../types";

export interface ITagService {
  /**
   *
   * @param userId
   * @param createTagDto
   * @return TagResponse
   */
  create(userId: string, createTagDto: CreateTagDto): Promise<TagResponse>;

  /**
   *
   * @param id
   * @param updateTagDto
   * @param userId
   * @return TagWithCreatorResponse
   */
  update(id: number, updateTagDto: UpdateTagDto, userId: string): Promise<TagWithCreatorResponse>;

  /**
   *
   * @param tagId
   * @param userId
   * @return TagEntity[]
   */
  delete(tagId: number, userId: string): Promise<TagEntity[]>;

  /**
   *
   * @param id
   * @return TagWithCreatorResponse
   */
  getTag(id: number): Promise<TagWithCreatorResponse>;

  /**
   *
   * @param userId
   * @return TagsResponse
   */
  getTagsByUser(userId: UserEntity['uid']): Promise<TagsResponse>;

  /**
   *
   * @param tags
   * @return TagEntity[]
   */
  getTagsById(tags: Array<TagEntity['id']>): Promise<TagEntity[]>;

  /**
   *
   * @param query
   * @return TagsWithPagination
   */
  getTagsWithCreator(query: QueryGetTagParams): Promise<TagsWithPagination>;
}