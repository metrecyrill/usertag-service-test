import {Response} from "express";
import {LoginUserDto, RegUserDto} from "../dtos";
import {TokenResponse} from "../responses";
import {TokensEntity} from "../entities/tokens.entity";

export interface IAuthService {
  /**
   *
   * @param response
   * @param userDto
   * @return TokenResponse
   */
  registration(response: Response, userDto: RegUserDto): Promise<TokenResponse>;

  /**
   *
   * @param response
   * @param userDto
   * @return TokenResponse
   */
  login(response: Response, userDto: LoginUserDto): Promise<TokenResponse>;

  /**
   *
   * @param response
   * @param userId
   * @param accessToken
   * @return TokensEntity[]
   */
  logout(response: Response, userId: string, accessToken: string): Promise<TokensEntity[]>;

  /**
   *
   * @param response
   * @param refreshToken
   * @return TokenResponse
   */
  refreshTokens(response: Response, refreshToken: string): Promise<TokenResponse>;
}