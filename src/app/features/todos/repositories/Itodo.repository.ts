import { Todo, TodoPriority } from '../models/todo.model';

export interface ITodoRepository {
  // ── Queries ─────────────────────────────────────────────
  findAll(): Promise<Todo[]>;
  findById(id: string): Promise<Todo | null>;

  // ── Commands ────────────────────────────────────────────
  add(
    title: string,
    description: string,
    priority: TodoPriority,
    categoryId: string
  ): Promise<Todo>;

  toggle(id: string): Promise<void>;

  update(
    id: string,
    changes: Partial<Pick<Todo, 'title' | 'description' | 'priority'>>
  ): Promise<void>;

  remove(id: string): Promise<void>;
}
