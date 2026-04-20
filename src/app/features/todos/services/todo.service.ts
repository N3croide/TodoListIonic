import { Injectable, inject, signal, computed } from '@angular/core';
import { Todo, TodoPriority, TodoStatus, createTodo } from '../models/todo.model';
import { StorageService } from 'src/app/shared/services/storage.service';

export type FilterType = 'all' | TodoStatus;

const STORAGE_KEY = 'todos_app';

@Injectable({ providedIn: 'root' })
export class TodoService {
   private readonly storage = inject(StorageService);

   // ── Estado ────────────────────────────────────────────────────────────────
   private readonly _todos = signal<Todo[]>(this.loadFromStorage());
   private readonly _filter = signal<FilterType>('all');

   // ── Computed públicos ─────────────────────────────────────────────────────
   readonly filter = this._filter.asReadonly();
   readonly pendingCount = computed(() => this._todos().filter((t) => t.status === 'pending').length);
   readonly completedCount = computed(() => this._todos().filter((t) => t.status === 'completed').length);
   readonly allCount = computed(() => this._todos().length);
   readonly filteredTodos = computed(() => {
      const f = this._filter();
      return f === 'all' ? this._todos() : this._todos().filter((t) => t.status === f);
   });

   // ── Acciones ──────────────────────────────────────────────────────────────
   add(title: string, description = '', priority: TodoPriority = 'medium', categoryId: string): void {
      if (!title.trim()) return;
      this.mutate((todos) => [...todos, createTodo({ title, description, priority }, categoryId)]);
   }

   toggle(id: string): void {
      this.mutate((todos) => todos.map((t) => (t.id === id ? { ...t, status: t.status === 'pending' ? 'completed' : ('pending' as TodoStatus) } : t)));
   }

   update(id: string, changes: Partial<Pick<Todo, 'title' | 'description' | 'priority'>>): void {
      this.mutate((todos) => todos.map((t) => (t.id === id ? { ...t, ...changes } : t)));
   }

   remove(id: string): void {
      this.mutate((todos) => todos.filter((t) => t.id !== id));
   }

   getById(id: string): Todo | undefined {
      return this._todos().find((t) => t.id === id);
   }

   setFilter(filter: FilterType): void {
      this._filter.set(filter);
   }

   allTodos(): Todo[] {
      return this._todos();
   }

   // ── Privado ───────────────────────────────────────────────────────────────
   private mutate(fn: (todos: Todo[]) => Todo[]): void {
      const next = fn(this._todos());
      this._todos.set(next);
      this.storage.set(STORAGE_KEY, next);
   }

   private loadFromStorage(): Todo[] {
      const raw = this.storage.get<Todo[]>(STORAGE_KEY);
      if (!raw) return [];
      return raw.map((t) => ({ ...t, createdAt: new Date(t.createdAt) }));
   }
}
