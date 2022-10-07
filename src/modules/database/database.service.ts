import {Injectable} from '@nestjs/common';
import {Pool, QueryArrayResult, QueryResult} from "pg";
import {IDatabase} from "./interfaces";
import {DeleteParams, InsertParams, QueryParams, UpdateParams} from "./types";


type QueryObject = {
  query: string,
  variables: any[]
}

@Injectable()
export class DatabaseService<T> implements IDatabase<T>{
  readonly tableName: string;

  constructor(private pool: Pool, tableName: string) {
    this.tableName = `"${tableName}"`;
  }

  query(query: string, variables: any[]): Promise<QueryArrayResult> {
    return this.pool.query(query, variables)
  }

  findOne(params: QueryParams<T>): Promise<T> {
    params.limit = 1;
    const {query, variables} = this.buildQuerySelect(params);

    return this.queryOne(query, variables);
  }

  findMany(params: QueryParams<T>): Promise<T[]> {
    const {query, variables} = this.buildQuerySelect(params);

    return this.queryAll(query, variables);
  }

  update(params: UpdateParams<T>): Promise<T> {
    const {query, variables} = this.buildQueryUpdate(params);

    return this.queryOne(query, variables);
  }

  insert(params: InsertParams<T>): Promise<T> {
    const {query, variables} = this.buildQueryInsert(params);

    return this.queryOne(query, variables);
  }

  async insertMany(params): Promise<void> {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

      const {query, variables} = this.buildQueryInsert(params);

      await client.query(query, variables)
      await client.query('COMMIT')
    } catch (error) {
      await client.query('ROLLBACK');
    } finally {
      client.release();
    }
  }

  delete(params: DeleteParams<T>): Promise<T[]> {
    const {query, variables} = this.buildQueryDelete(params);

    return this.queryAll(query, variables);
  }

  queryAll(query: string, variables: any[]): Promise<T[]> {
    return this.pool.query(query, variables).then((result: QueryResult) => {
      return result.rows;
    });
  }

  async queryOne(query: string, variables: any[]): Promise<T> {
    const result = await this.queryAll(query, variables);

    return result[0];
  }

  private buildQuerySelect(params: QueryParams<T>): QueryObject {
    let query = 'SELECT ';
    const variables = [];
    let varIndex = 0;

    if (params.select && params.select?.length) {
      params.select.forEach((select, index) => {
        query += 'main.' + String(select);
        query += (index === params.select.length - 1) ? ' ' : ', ';
      })
    } else {
      query += 'main.* ';
    }

    // todo make multiple join
    if (params.join && params.join?.select) {
      query += params.join.select.length ? ', ' : `, ${params.join.alias}.* `;
      params.join.select.forEach((select, index) => {
        query += params.join.alias + '.' + String(select);
        query += (index === params.join.select.length - 1) ? ' ' : ', ';
      });
    }

    query += 'FROM ' + this.tableName + ' main ';

    // todo make multiple join and add other types (not only LEFT)
    if (params.join) {
      query += `JOIN "${params.join.table}" ${params.join.alias} ON main.${String(params.join.on.main)} ${params.join.on.condition} ${params.join.alias}.${params.join.on.join} `;
    }

    const where = Object.keys(params.where || {});
    if (where && where.length) {
      query += 'WHERE ';
    }
    where.forEach((key, index) => {
      if (index !== 0) {
        query += 'AND ';
      }
      if (Array.isArray(params.where[key])) {
        query += key + ' IN (';
        params.where[key].forEach((value, indexValue) => {
          query += '$' + ++varIndex + ((indexValue === params.where[key].length - 1) ? ') ' : ', ');
          variables.push(value);
        })
      } else {
        query += key + ' = $' + ++varIndex + ' ';
        variables.push(params.where[key]);
      }
    });

    const orderBy = Object.keys(params.orderBy || {});
    if (params.orderBy && orderBy.length) {
      query += 'ORDER BY ';

      orderBy.forEach((order, index) => {
        query += `${order} ${params.orderBy[order]}`;
        query += (index === orderBy.length - 1) ? ' ' : ', ';
      })
    }

    query += (params.offset) ? `OFFSET ${params.offset} ` : '';
    query += (params.limit) ? `LIMIT ${params.limit}` : '';

    return {
      query,
      variables
    };
  }

  private buildQueryInsert(params: InsertParams<T>): QueryObject {
    let query = 'INSERT INTO ' + this.tableName + ' (';
    let values = '';
    let varIndex = 0;
    const variables = [];
    params.values.forEach((insert, index) => {
      values += '(';
      const keys = Object.keys(insert);
      keys.forEach((key, keyIndex) => {
        if (index === 0) {
          query += key + ((keyIndex === keys.length - 1) ? ') ' : ', ');
        }
        values += '$' + ++varIndex + ((keyIndex === keys.length - 1) ? ')' : ', ');
        variables.push(insert[key]);
      });
      values += (index === params.values.length - 1) ? ' ' : ', ';
    });

    query += 'VALUES ' + values + 'RETURNING ';
    query += (params.select?.length) ? params.select : '*';

    return {
      query,
      variables
    };
  }

  private buildQueryUpdate(params: UpdateParams<T>): QueryObject {
    let query = 'UPDATE ' + this.tableName + ' SET ';
    const values = Object.keys(params.values);
    const variables = values.map((key, index) => {
      query += key + ' = $' + (index + 1) + ((index === values.length - 1) ? ' ' : ', ');
      return params.values[key];
    })

    query += 'WHERE ';
    const where = Object.keys(params.where);
    where.forEach((key, index) => {
      query += key + ' = ' + '$' + (values.length + 1 + index)  + ((index === where.length - 1) ? ' ' : ', ');
      variables.push(params.where[key])
    })

    query += 'RETURNING ';
    query += (params.select?.length) ? params.select : '*';

    return {
      query,
      variables
    };
  }

  private buildQueryDelete(params: DeleteParams<T>): QueryObject {
    let query = 'DELETE FROM ' + this.tableName + ' WHERE ';
    const where = Object.keys(params.where);
    const variables = where.map((key, index) => {
      query += key + ' = $' + (index + 1);
      query += (index === where.length - 1) ? ' ' : ' AND ';
      return params.where[key];
    })

    return {
      query,
      variables
    };
  }

  async count(): Promise<number> {
    const query = `SELECT COUNT(*) as count FROM ` + this.tableName;
    return await this.query(query, []).then(result => {
      return +result.rows[0]['count'];
    });
  }
}
