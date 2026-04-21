import { TableDefinition } from 'src/app/core/database/Itable-definition';
import { provideTable } from 'src/app/core/database/provide-table';

export const provideCategoryDb = () => provideTable(CATEGORIES_TABLE);

const CATEGORIES_TABLE: TableDefinition = {
   name: 'categories',
   createSql: `
     CREATE TABLE IF NOT EXISTS categories (
         id TEXT PRIMARY KEY,
         name TEXT NOT NULL,
         created_at TEXT NOT NULL
      )
   `,
};
