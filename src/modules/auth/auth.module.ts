import {Module} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import {JwtModule} from "@nestjs/jwt";
import {UserModule} from "../user/user.module";
import {AccessTokenStrategy, RefreshTokenStrategy} from "./strategies";
import {TokenService} from "./services/token.service";
import {DatabaseModule} from "../database/database.module";

@Module({
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy, TokenService],
  imports: [
      UserModule,
      DatabaseModule.forFeature(['tokens_storage']),
      JwtModule.register({})
  ]
})
export class AuthModule {}
