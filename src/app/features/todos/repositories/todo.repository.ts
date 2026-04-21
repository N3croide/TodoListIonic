import { inject, Injectable } from '@angular/core';
import { DatabaseService } from 'src/app/core/database/database.service';
import { Todo, TodoPriority, TodoStatus, createTodo } from '../models/todo.model';
import { ITodoRepository } from './Itodo.repository';

@Injectable({ providedIn: 'root' })
export class TodoRepository implements ITodoRepository {
   private readonly db = inject(DatabaseService);

   private readonly TABLE = 'todos';

   // ── Mappers ─────────────────────────────────────────────

   private toDomain(row: any): Todo {
      return {
         id: row.id,
         title: row.title,
        description: row.description ? decodeURIComponent(row.description) : '',
         status: row.status,
         priority: row.priority,
         categoryId: row.category_id,
         createdAt: new Date(row.created_at),
         updatedAt: new Date(row.updated_at),
      };
   }

   private toRow(todo: Todo) {
      return {
         id: todo.id,
         title: todo.title,
        description: todo.description ? encodeURIComponent(todo.description) : '',
         status: todo.status,
         priority: todo.priority,
         category_id: todo.categoryId,
         created_at: todo.createdAt.toISOString(),
         updated_at: todo.updatedAt.toISOString(),
      };
   }

   // ── Queries ─────────────────────────────────────────────

   async findAll(): Promise<Todo[]> {
      const rows = await this.db.select(this.TABLE);
      return rows.map((r) => this.toDomain(r));
   }

   async findById(id: string): Promise<Todo | null> {
      const rows = await this.db.select(this.TABLE, { id });
      if (!rows.length) return null;
      return this.toDomain(rows[0]);
   }

   async add(title: string, description: string, priority: TodoPriority, categoryId: string): Promise<Todo> {
      const todo = createTodo({ title, description, priority }, categoryId);
      await this.db.insert(this.TABLE, this.toRow(todo));
      return todo;
   }

   async toggle(id: string): Promise<void> {
      const todo = await this.findById(id);
      if (!todo) return;

      const newStatus: TodoStatus = todo.status === 'pending' ? 'completed' : 'pending';

      await this.db.update(
         this.TABLE,
         {
            status: newStatus,
            updated_at: new Date().toISOString(),
         },
         { id },
      );
   }

   async update(id: string, changes: Partial<Pick<Todo, 'title' | 'description' | 'priority'>>): Promise<void> {
      if (!Object.keys(changes).length) return;

      const mappedChanges: any = {
         ...changes,
         updated_at: new Date().toISOString(),
      };
      await this.db.update(this.TABLE, mappedChanges, { id });
   }

   async remove(id: string): Promise<void> {
      await this.db.delete(this.TABLE, { id });
   }
}
