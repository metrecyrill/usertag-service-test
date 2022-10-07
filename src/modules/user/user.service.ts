import {forwardRef, HttpException, HttpStatus, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {DatabaseService} from "../database/database.service";
import {DatabaseTable} from "../database/common/database.decorator";
import * as bcrypt from 'bcrypt';
import {UserEntity} from "./entities/user.entity";
import {UpdateUserDto} from "./dtos";
import {InsertParams, UpdateParams} from "../database/types";
import {TagService} from "../tag/services/tag.service";
import {RegUserDto} from "../auth/dtos";
import {GetUserResponse, UpdateUserResponse} from "./responses";

@Injectable()
export class UserService {
  constructor(
    @DatabaseTable('user')
    private databaseService: DatabaseService<UserEntity>,
    @Inject(forwardRef(() => TagService))
    private tagService: TagService
  ) {
  }

  async create(createUserDto: RegUserDto): Promise<UserEntity> {
    try {
      const {email, password, nickname} = createUserDto;
      const salt = await bcrypt.genSalt();

      const insertParams: InsertParams<UserEntity> = {
        values: [
          {
            email,
            password: await bcrypt.hash(password, salt),
            nickname
          },
        ],
      };

      return await this.databaseService.insert(insertParams);
    } catch (error) {
      if (error?.constraint === 'user_nickname_key') {
        throw new HttpException('User with this nickname is already exist', HttpStatus.BAD_REQUEST);
      } else if (error?.constraint === 'user_email_key') {
        throw new HttpException('User with this email is already exist', HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException('Something is goings wrong.', HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }

  async get(userId: string): Promise<GetUserResponse> {
    const user = await this.databaseService.findOne({ where: {uid: userId} });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const {tags} = await this.tagService.getTagsByUser(user.uid);

    return {
      email: user.email,
      nickname: user.nickname,
      tags,
    };
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    return await this.databaseService.findOne({ where : {email} });
  }

  async getUserByUid(uid: string): Promise<UserEntity> {
    return await this.databaseService.findOne({ where : {uid} });
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<UpdateUserResponse> {
    try {
      const {email, password, nickname} = updateUserDto;
      const salt = await bcrypt.genSalt();

      const updateParams: UpdateParams<UserEntity> = {
        values: {
          email,
          password: await bcrypt.hash(password, salt),
          nickname
        },
        where: { uid: userId }
      };

      const user = await this.databaseService.update(updateParams);

      return {
        email: user.email,
        nickname: user.nickname
      };
    } catch (error) {
      if (error?.constraint === 'user_nickname_key') {
        throw new HttpException('User with this nickname is already exist', HttpStatus.BAD_REQUEST);
      } else if (error?.constraint === 'user_email_key') {
        throw new HttpException('User with this email is already exist', HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException('Something is goings wrong.', HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }

  async delete(userId: string): Promise<UserEntity[]> {
    return await this.databaseService.delete({ where: {uid: userId} });
  }
}
