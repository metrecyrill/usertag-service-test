import {forwardRef, Module} from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {DatabaseModule} from "../database/database.module";
import {TagModule} from "../tag/tag.module";

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    forwardRef(() => TagModule),
    DatabaseModule.forFeature(['user']),
  ],
  exports: [UserService]
})
export class UserModule {}
