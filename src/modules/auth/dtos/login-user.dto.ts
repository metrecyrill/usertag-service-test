import {RegUserDto} from "./reg-user.dto";
import {OmitType, PartialType} from "@nestjs/swagger";


export class LoginUserDto extends PartialType(
  OmitType(RegUserDto, ['nickname'] as const)) {}
