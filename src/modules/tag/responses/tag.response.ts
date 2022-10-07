import {TagEntity} from "../entities/tag.entity";
import {UserEntity} from "../../user/entities/user.entity";
import {OmitType} from "@nestjs/swagger";

export class Meta {
  pageSize: number;
  page: number;
  quantity: number;
}

export class TagResponse extends OmitType(TagEntity, ["creator"] as const) {}

export class TagWithCreatorResponse extends OmitType(TagEntity, ["creator", "id"] as const) {
  creator: Omit<UserEntity, "password" | "email" >
}

export class TagsResponse {
  tags: Omit<TagEntity, "creator">[];
}

export class TagsWithPagination {
  data: TagWithCreatorResponse[];
  meta: Meta;
}
