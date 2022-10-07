import {Body, Controller, Get, HttpCode, Post, Res, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {AuthService} from "./services/auth.service";
import {AccessTokenGuard, RefreshTokenGuard} from "./guards";
import {GetAccessToken, GetRefreshToken, GetUserId} from "./decorators";
import {Response} from "express";
import {LoginUserDto, RegUserDto} from "./dtos";
import {TokenResponse} from "./responses";

@ApiTags('Auth')
@Controller('api')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('/signin')
    @ApiOperation({ summary: 'Sign in user' })
    @ApiResponse({ status: 201, type: TokenResponse })
    @ApiResponse({ status: 400 })
    registration(@Res({ passthrough: true }) response: Response, @Body() userDto: RegUserDto): Promise<TokenResponse> {
        return this.authService.registration(response, userDto);
    }

    @Post('/login')
    @ApiOperation({ summary: 'Log in user' })
    @ApiResponse({ status: 201, type: TokenResponse })
    @ApiResponse({ status: 400 })
    login(@Res({ passthrough: true }) response: Response, @Body() userDto: LoginUserDto): Promise<TokenResponse> {
        return this.authService.login(response, userDto);
    }

    @UseGuards(AccessTokenGuard)
    @Post('/logout')
    @HttpCode(200)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Log out user' })
    @ApiResponse({ status: 200 })
    logout(@Res({ passthrough: true }) response: Response, @GetUserId() userId: string, @GetAccessToken() accessToken: string): Promise<void> {
        return this.authService.logout(response, userId, accessToken);
    }

    @UseGuards(RefreshTokenGuard)
    @Get('refresh')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Refresh user token' })
    @ApiResponse({ status: 200, type: TokenResponse })
    refreshTokens(@Res({ passthrough: true }) response: Response, @GetRefreshToken() refreshToken: string): Promise<TokenResponse> {
        return this.authService.refreshTokens(response, refreshToken);
    }
}
