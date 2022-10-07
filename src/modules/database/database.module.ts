import {DynamicModule, Module} from '@nestjs/common';
import {Pool, PoolConfig} from "pg";
import {DATABASE_POOL} from "./common/database.constants";
import {DatabaseService} from "./database.service";
import {DatabaseCoreModule} from "./database-core.module";
import {createDatabaseProviderToken} from "./common/database.utils";

@Module({})
export class DatabaseModule {
  static forRoot(options?: PoolConfig): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [DatabaseCoreModule.forRoot(options)],
    };
  }

  static forFeature(entities: string[]) {
    const exports = [];
    const providers = entities.map(entity => {
      const token = createDatabaseProviderToken(entity);
      exports.push(token);

      return {
        inject: [DATABASE_POOL],
        provide: token,
        useFactory: (pool: Pool) => {
          return new DatabaseService(pool, entity);
        },
      }
    })

    return {
      module: DatabaseModule,
      providers,
      exports,
    };
  }
}
