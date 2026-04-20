import { TableDefinition } from 'src/app/core/database/Itable-definition';
import { provideTable } from 'src/app/core/database/provide-table';

export const provideTodoDb = () => provideTable(TODOS_TABLE);

const TODOS_TABLE:TableDefinition = {
   name:'todos',
   createSql:''
}
