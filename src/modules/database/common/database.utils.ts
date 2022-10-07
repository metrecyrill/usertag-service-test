import {DATABASE_FEATURE} from "./database.constants";

export function createDatabaseProviderToken(tableName: string): string {
  return `${DATABASE_FEATURE}:${tableName.toUpperCase()}`;
}