import { TableDefinition } from 'src/app/core/database/Itable-definition';
import { provideTable } from 'src/app/core/database/provide-table';

export const provideTodoDb = () => provideTable(TODOS_TABLE);

const TODOS_TABLE: TableDefinition = {
   name: 'todos',
   createSql: `
      CREATE TABLE IF NOT EXISTS todos (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT DEFAULT '',
            status TEXT DEFAULT 'pending',
            priority TEXT DEFAULT 'medium',
            category_id TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
         )
   `,
};
