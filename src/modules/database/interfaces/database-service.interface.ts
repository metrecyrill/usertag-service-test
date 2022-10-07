import {QueryArrayResult} from "pg";
import {DeleteParams, InsertParams, QueryParams, UpdateParams} from "../types";

export interface IDatabase<T> {
  readonly tableName: string;

  /**
   * method specifically for running queries
   * @param query
   * @param variables
   * @return QueryArrayResult
   */
  query(query: string, variables: any[]): Promise<QueryArrayResult>;

  /**
   * method specifically for running queries and get array of element
   * @param query
   * @param variables
   * @return T[]
   */
  queryAll(query: string, variables: any[]): Promise<Partial<T>[]>;

  /**
   * method specifically for running queries and get first element
   * @param query
   * @param variables
   * @return T
   */
  queryOne(query: string, variables: any[]): Promise<Partial<T>>;

  /**
   *
   * @param params
   * @return T
   */
  findOne(params: QueryParams<T>): Promise<T>;

  /**
   *
   * @param params
   * @return T[]
   */
  findMany(params: QueryParams<T>): Promise<T[]>;

  /**
   *
   * @param params
   * @return T
   */
  update(params: UpdateParams<T>): Promise<T>;

  /**
   *
   * @param params
   * @return T
   */
  insert(params: InsertParams<T>): Promise<T>;

  /**
   *
   * @param params
   */
  insertMany(params): Promise<void>;

  /**
   *
   * @param params
   * @return T[]
   */
  delete(params: DeleteParams<T>): Promise<T[]>;

  /**
   * @return number
   */
  count(): Promise<number>;
}