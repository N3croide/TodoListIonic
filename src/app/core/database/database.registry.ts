import { Injectable } from '@angular/core';
import { TableDefinition } from './Itable-definition';

@Injectable({ providedIn: 'root' })
export class DatabaseRegistry {
  private readonly tables: TableDefinition[] = [];

  register(table: TableDefinition) {
    this.tables.push(table);
  }

  getTables(): TableDefinition[] {
    return this.tables;
  }
}
