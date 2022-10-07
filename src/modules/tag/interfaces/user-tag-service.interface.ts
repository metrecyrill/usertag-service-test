import {UserEntity} from "../../user/entities/user.entity";
import {TagsResponse} from "../responses";
import {AddTagsDto} from "../dtos/add-tags.dto";

export interface IUserTagService {
  /**
   *
   * @param userId
   * @param id
   * @return TagsResponse
   */
  deleteTag(userId: UserEntity["uid"], id: number): Promise<TagsResponse>;

  /**
   *
   * @param userId
   * @param addTagsDto
   * @return TagsResponse
   */
  addTags(userId: string, addTagsDto: AddTagsDto): Promise<TagsResponse>;
}