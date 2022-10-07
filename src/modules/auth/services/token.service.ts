import {Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {DatabaseService} from "../../database/database.service";
import {TokensEntity} from "../entities/tokens.entity";
import {DatabaseTable} from "../../database/common/database.decorator";
import {UserEntity} from "../../user/entities/user.entity";
import {JwtPayload, Tokens} from "../types";
import {InsertParams, UpdateParams} from "../../database/types";
import {ITokenService} from "../interfaces/token.service.interface";

@Injectable()
export class TokenService implements ITokenService {

  constructor(private jwtService: JwtService,
              @DatabaseTable('tokens_storage')
              private databaseService: DatabaseService<TokensEntity>) {}

  async create(user: UserEntity): Promise<Tokens> {
    const tokens: Tokens = await this.generate(user.uid, user.email);

    const insertParams: InsertParams<TokensEntity> = {
      values: [
        {
          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken,
          user_id: user.uid,
        },
      ],
    }

    await this.databaseService.insert(insertParams);

    return tokens;
  }

  async findByRefreshToken(refreshToken: string): Promise<TokensEntity> {
    return await this.databaseService.findOne({ where: {refresh_token: refreshToken} })
  }

  async update(userId: string, payload: JwtPayload): Promise<TokensEntity> {
    const tokens = await this.generate(payload.sub, payload.email);

    const updateParams: UpdateParams<TokensEntity> = {
      values: {
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
      },
      where: {user_id: userId}
    }

    return await this.databaseService.update(updateParams);
  }

  async delete(userId: string, accessToken: string): Promise<TokensEntity[]> {
    return await this.databaseService.delete({ where: { user_id: userId, access_token: accessToken } });
  }

  private async generate(userId: string, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        jwtPayload,
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '30m',
        },
      ),
      this.jwtService.signAsync(
        jwtPayload,
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
