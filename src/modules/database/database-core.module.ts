import {DynamicModule, Global, Module} from '@nestjs/common';
import {Pool, PoolConfig} from "pg";
import {DATABASE_POOL} from "./common/database.constants";

@Global()
@Module({})
export class DatabaseCoreModule {
  static forRoot(config: PoolConfig): DynamicModule {
    const pool = {
      provide: DATABASE_POOL,
      useValue: new Pool(config),
    }

    return {
      module: DatabaseCoreModule,
      providers: [pool],
      exports: [pool]
    };
  }
}
