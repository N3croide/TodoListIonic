import { Injectable, inject } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { from, Observable } from 'rxjs';

import { DatabaseRegistry } from './database.registry';
import { DB_TABLE_HOOK } from './datable.token';

type Where = Record<string, any>;
type Data = Record<string, any>;

@Injectable({ providedIn: 'root' })
export class DatabaseService {
  private readonly sqlite = inject(SQLite);
  private readonly platform = inject(Platform);
  private readonly registry = inject(DatabaseRegistry);

  // Hook para ejecutar factories
  // @ts-ignore
  private readonly _ = inject(DB_TABLE_HOOK, { optional: true });

  private db!: SQLiteObject;

  readonly ready$: Observable<void> = from(this.initDB());

  private async initDB(): Promise<void> {
    await this.platform.ready();

    this.db = await this.sqlite.create({
      name: 'app.db',
      location: 'default',
    });

    await this.createTables();
  }

  private async createTables(): Promise<void> {
    const tables = this.registry.getTables();

    await this.db.executeSql('PRAGMA foreign_keys = OFF;', []);

    for (const table of tables) {
      await this.db.executeSql(table.createSql, []);
    }

    await this.db.executeSql('PRAGMA foreign_keys = ON;', []);
  }

  //HELPERS
  async insert(table: string, data: Data): Promise<void> {
    const { sql, params } = this.buildInsert(table, data);
    await this.db.executeSql(sql, params);
  }

  async select<T = any>(table: string, where?: Where): Promise<T[]> {
    const { sql, params } = this.buildSelect(table, where);
    const result = await this.db.executeSql(sql, params);

    const rows: T[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      rows.push(result.rows.item(i));
    }

    return rows;
  }

  async update(table: string, data: Data, where: Where): Promise<void> {
    const { sql, params } = this.buildUpdate(table, data, where);
    await this.db.executeSql(sql, params);
  }

  async delete(table: string, where: Where): Promise<void> {
    const { sql, params } = this.buildDelete(table, where);
    await this.db.executeSql(sql, params);
  }

  //BUILDERS
  private buildInsert(table: string, data: Data) {
    const keys = Object.keys(data);
    const values = Object.values(data);

    const columns = keys.join(', ');
    const placeholders = keys.map(() => '?').join(', ');

    return {
      sql: `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`,
      params: values,
    };
  }

  private buildSelect(table: string, where?: Where) {
    if (!where || Object.keys(where).length === 0) {
      return {
        sql: `SELECT * FROM ${table}`,
        params: [],
      };
    }

    const keys = Object.keys(where);
    const values = Object.values(where);

    const conditions = keys.map((k) => `${k} = ?`).join(' AND ');

    return {
      sql: `SELECT * FROM ${table} WHERE ${conditions}`,
      params: values,
    };
  }

  private buildUpdate(table: string, data: Data, where: Where) {
    const dataKeys = Object.keys(data);
    const dataValues = Object.values(data);

    const setClause = dataKeys.map((k) => `${k} = ?`).join(', ');

    const whereKeys = Object.keys(where);
    const whereValues = Object.values(where);

    const whereClause = whereKeys.map((k) => `${k} = ?`).join(' AND ');

    return {
      sql: `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`,
      params: [...dataValues, ...whereValues],
    };
  }

  private buildDelete(table: string, where: Where) {
    const keys = Object.keys(where);
    const values = Object.values(where);

    const conditions = keys.map((k) => `${k} = ?`).join(' AND ');

    return {
      sql: `DELETE FROM ${table} WHERE ${conditions}`,
      params: values,
    };
  }

  // ─────────────────────────────────────────────────────

  getDb(): SQLiteObject {
    return this.db;
  }
}
