import {UserEntity} from "../../user/entities/user.entity";
import {JwtPayload, Tokens} from "../types";
import {TokensEntity} from "../entities/tokens.entity";

export interface ITokenService {
  /**
   *
   * @param user
   * @return Tokens
   */
  create(user: UserEntity): Promise<Tokens>;


  /**
   *
   * @param refreshToken
   * @return TokensEntity
   */
  findByRefreshToken(refreshToken: string): Promise<TokensEntity>;

  /**
   *
   * @param userId
   * @param payload
   * @return TokensEntity
   */
  update(userId: string, payload: JwtPayload): Promise<TokensEntity>;

  /**
   *
   * @param userId
   * @param accessToken
   * @return TokensEntity[]
   */
  delete(userId: string, accessToken: string): Promise<TokensEntity[]>;
}