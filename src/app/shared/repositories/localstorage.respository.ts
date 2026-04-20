// ─── Implementación concreta de ITodoRepository ─────────────
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { ITodoRepository } from './todo.respository';
import { Todo } from '../entities/todo.entity';

const STORAGE_KEY = 'todos_app';

@Injectable()
export class LocalStorageTodoRepository extends ITodoRepository {

  private read(): Todo[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return (JSON.parse(raw) as Todo[]).map(t => ({
        ...t,
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt),
      }));
    } catch {
      return [];
    }
  }

  private write(todos: Todo[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }

  override getAll(): Observable<Todo[]> {
    return of(this.read());
  }

  override getById(id: string): Observable<Todo | undefined> {
    return of(this.read().find(t => t.id === id));
  }

  override save(todo: Todo): Observable<Todo> {
    const todos = this.read();
    if (todos.some(t => t.id === todo.id)) {
      return throwError(() => new Error(`Todo ${todo.id} ya existe`));
    }
    this.write([...todos, todo]);
    return of(todo);
  }

  override update(todo: Todo): Observable<Todo> {
    const todos = this.read();
    const idx   = todos.findIndex(t => t.id === todo.id);
    if (idx === -1) return throwError(() => new Error(`Todo ${todo.id} no encontrado`));
    todos[idx] = todo;
    this.write(todos);
    return of(todo);
  }

  override delete(id: string): Observable<void> {
    this.write(this.read().filter(t => t.id !== id));
    return of(void 0);
  }

  override deleteAll(): Observable<void> {
    this.write([]);
    return of(void 0);
  }
}
