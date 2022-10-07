import {Conditions} from "../enums/condition.enum";

export type InsertParams<T> = {
  values: Array<Partial<T>>,
  select?: Array<keyof T>;
}

export type JoinParams<T> = {
  table: string;
  alias: string;
  type?: string;
  on: {
    main: keyof T;
    join: string;
    condition: Conditions
  };
  select?: string[];
}

export type QueryParams<T> = {
  select?: Array<keyof T | '*'>;
  join?: JoinParams<T>;
  where?: {
    [Property in keyof Partial<T>]: T[Property] | T[Property][];
  }
  orderBy?: Partial<Record<keyof T, 'ASC' | 'DESC'>>;
  offset?: number;
  limit?: number;
}

export type UpdateParams<T> = {
  select?: Array<keyof T>;
  values: Partial<T>;
  where: Partial<T>;
}

export type DeleteParams<T> = {
  where: Partial<T>;
}