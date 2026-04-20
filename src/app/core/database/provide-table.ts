// core/database/provide-table.ts
import { inject, makeEnvironmentProviders } from '@angular/core';
import { DatabaseRegistry } from './database.registry';
import { TableDefinition } from './Itable-definition';
import { DB_TABLE_HOOK } from './datable.token';

export function provideTable(table: TableDefinition) {
  return makeEnvironmentProviders([
    {
      provide: DB_TABLE_HOOK,
      multi: true,
      useFactory: () => {
        const registry = inject(DatabaseRegistry);
        registry.register(table);
        return true;
      }
    }
  ]);
}
