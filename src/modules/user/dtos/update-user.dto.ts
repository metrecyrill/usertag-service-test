import {PartialType} from "@nestjs/mapped-types";
import {RegUserDto} from "../../auth/dtos";

export class UpdateUserDto extends PartialType(RegUserDto) {}