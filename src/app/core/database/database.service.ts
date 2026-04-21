import { Injectable, inject } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { DatabaseRegistry } from './database.registry';
import { DB_TABLE_HOOK } from './datable.token';

type Where = Record<string, any>;
type Data = Record<string, any>;

@Injectable({ providedIn: 'root' })
export class DatabaseService {
   private readonly sqlite = inject(SQLite);
   private readonly registry = inject(DatabaseRegistry);
   private readonly dbReady: Promise<void>;

   // @ts-ignore
   private readonly _ = inject(DB_TABLE_HOOK, { optional: true });

   private db!: SQLiteObject;

   constructor() {
      this.dbReady = this.initDB();
   }

   private async initDB(): Promise<void> {
      await new Promise<void>((resolve) => {
         if ((window as any).cordova) {
            document.addEventListener('deviceready', () => resolve(), { once: true });
         } else {
            resolve();
         }
      });

      this.db = await this.sqlite.create({ name: 'app.db', location: 'default' });
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

   async insert(table: string, data: Data): Promise<void> {
      await this.dbReady;
      try {
         const { sql, params } = this.buildInsert(table, data);
         await this.db.executeSql(sql, params);
      } catch (error) {
         alert('Error inserting data: ' + (error as any).message);
      }
   }

   async select<T = any>(table: string, where?: Where): Promise<T[]> {
      await this.dbReady;
      const rows: T[] = [];
      try {
         const { sql, params } = this.buildSelect(table, where);
         const result = await this.db.executeSql(sql, params);
         for (let i = 0; i < result.rows.length; i++) rows.push(result.rows.item(i));
      } catch (error) {
         alert('Error selecting data: ' + (error as any).message);
      }
      return rows;
   }

   async update(table: string, data: Data, where: Where): Promise<void> {
      await this.dbReady;
      try {
         const { sql, params } = this.buildUpdate(table, data, where);
         await this.db.executeSql(sql, params);
      } catch (error) {
         alert('Error updating data: ' + (error as any).message);
      }
   }

   async delete(table: string, where: Where): Promise<void> {
      await this.dbReady;
      try {
         const { sql, params } = this.buildDelete(table, where);
         await this.db.executeSql(sql, params);
      } catch (error) {
         alert('Error deleting data: ' + (error as any).message);
      }
   }

   private buildInsert(table: string, data: Data) {
      const keys = Object.keys(data);
      return {
         sql: `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`,
         params: Object.values(data),
      };
   }

   private buildSelect(table: string, where?: Where) {
      if (!where || !Object.keys(where).length) return { sql: `SELECT * FROM ${table}`, params: [] };
      const keys = Object.keys(where);
      return {
         sql: `SELECT * FROM ${table} WHERE ${keys.map((k) => `${k} = ?`).join(' AND ')}`,
         params: Object.values(where),
      };
   }

   private buildUpdate(table: string, data: Data, where: Where) {
      return {
         sql: `UPDATE ${table} SET ${Object.keys(data)
            .map((k) => `${k} = ?`)
            .join(', ')} WHERE ${Object.keys(where)
            .map((k) => `${k} = ?`)
            .join(' AND ')}`,
         params: [...Object.values(data), ...Object.values(where)],
      };
   }

   private buildDelete(table: string, where: Where) {
      return {
         sql: `DELETE FROM ${table} WHERE ${Object.keys(where)
            .map((k) => `${k} = ?`)
            .join(' AND ')}`,
         params: Object.values(where),
      };
   }

   getDb(): SQLiteObject {
      return this.db;
   }
}
