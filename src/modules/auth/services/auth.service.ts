import {ForbiddenException, HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs';
import {UserService} from "../../user/user.service";
import {TokenService} from "./token.service";
import {JwtPayload} from "../types";
import {Response} from "express";
import {UserEntity} from "../../user/entities/user.entity";
import {LoginUserDto, RegUserDto} from "../dtos";
import {TokenResponse} from "../responses";
import {TokensEntity} from "../entities/tokens.entity";
import {IAuthService} from "../interfaces/auth.service.interface";

@Injectable()
export class AuthService implements IAuthService {

  constructor(private userService: UserService,
              private jwtService: JwtService,
              private tokenService: TokenService) {}


  async registration(response: Response, userDto: RegUserDto): Promise<TokenResponse> {
    const user = await this.userService.create(userDto);
    const tokens = await this.tokenService.create(user);

    response.cookie('refresh_token', tokens.refreshToken, {httpOnly: true, maxAge: 7*24*60*60});

    return {
      token: tokens.accessToken,
      expire: '1800'
    }
  }

  async login(response: Response, userDto: LoginUserDto): Promise<TokenResponse> {
    const user = await this.validateUser(userDto);
    const tokens = await this.tokenService.create(user);
    response.cookie('refresh_token', tokens.refreshToken, {httpOnly: true, maxAge: 7*24*60*60});

    return {
      token: tokens.accessToken,
      expire: '1800'
    }
  }

  async logout(response: Response, userId: string, accessToken: string): Promise<TokensEntity[]> {
    response.clearCookie('refresh_token');
    return await this.tokenService.delete(userId, accessToken);
  }

  private async validateUser(userDto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userService.getUserByEmail(userDto.email);
    const passwordEquals = await bcrypt.compare(userDto.password, user?.password || '');
    if (user && passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({message: 'Incorrect password or email'})
  }

  async refreshTokens(response: Response, refreshToken: string): Promise<TokenResponse> {
    if (!refreshToken) {
      throw new ForbiddenException('Access denied');
    }

    const jwtPayload: JwtPayload = await this.jwtService.verifyAsync(refreshToken, {secret: process.env.JWT_REFRESH_SECRET});
    const tokens = await this.tokenService.findByRefreshToken(refreshToken);
    if (!tokens || !jwtPayload) {
      throw new ForbiddenException('Access denied');
    }

    const newTokens = await this.tokenService.update(tokens.user_id, jwtPayload);
    response.cookie('refresh_token', newTokens.refresh_token, {httpOnly: true, maxAge: 7*24*60*60});

    return {
      token: newTokens.access_token,
      expire: '1800'
    }
  }
}
