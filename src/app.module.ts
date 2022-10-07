import {CacheModule, Module} from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/user/user.module';
import {AuthModule} from "./modules/auth/auth.module";
import { TagModule } from './modules/tag/tag.module';
import * as redisStore from "cache-manager-redis-store";
import type { ClientOpts } from 'redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    DatabaseModule.forRoot({
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      host: process.env.PGHOST,
      port: Number(process.env.PGPORT),
    }),
    // CacheModule.register<ClientOpts>({
    //   isGlobal: true,
    //   store: redisStore,
    //   host: 'localhost',
    //   port: 6379
    // }),
    UserModule,
    AuthModule,
    TagModule
  ]
})
export class AppModule {}
