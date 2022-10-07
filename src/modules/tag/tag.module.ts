import {forwardRef, Module} from '@nestjs/common';
import { TagService } from './services/tag.service';
import { TagController } from './controllers/tag.controller';
import {DatabaseModule} from "../database/database.module";
import {UserModule} from "../user/user.module";
import {UserTagController} from "./controllers/user-tag.controller";
import {UserTagService} from "./services/user-tag.service";

@Module({
  providers: [TagService, UserTagService ],
  controllers: [TagController, UserTagController],
  imports: [
    forwardRef(() => UserModule),
    DatabaseModule.forFeature(['tag', 'userTag']),
  ],
  exports: [TagService, UserTagService]
})
export class TagModule {}
