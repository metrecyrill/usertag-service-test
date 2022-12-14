import {Inject} from "@nestjs/common";
import {createDatabaseProviderToken} from "./database.utils";

export const DatabaseTable = (tableName: string) => {
  return Inject(createDatabaseProviderToken(tableName));
};
