import {UserEntity} from "../entities/user.entity";
import {TagsResponse} from "../../tag/responses";
import {IntersectionType, OmitType} from "@nestjs/swagger";


export class GetUserResponse extends IntersectionType(
  OmitType(UserEntity, ['uid', 'password'] as const),
  TagsResponse
){}

export class UpdateUserResponse extends OmitType(GetUserResponse, ['tags'] as const) {}

