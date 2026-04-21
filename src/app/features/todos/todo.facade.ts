import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { TodoService, FilterType } from './services/todo.service';
import { Todo, TodoPriority } from './models/todo.model';
import { CategoryFacade } from '../categories/category.facade';

@Injectable({ providedIn: 'root' })
export class TodoFacade {
   constructor() {
      this.todoService.load();
   }

   private readonly todoService = inject(TodoService);
   private readonly categoryFacade = inject(CategoryFacade);

   private readonly router = inject(Router);

   readonly categories = this.categoryFacade.categories;

   readonly selectedCategoryId = signal<string | null>(null);

   readonly filter = this.todoService.filter;
   readonly pendingCount = this.todoService.pendingCount;
   readonly completedCount = this.todoService.completedCount;
   readonly allCount = this.todoService.allCount;

   readonly filteredTodos = computed(() => {
      const todos = this.todoService.filteredTodos();
      const categoryId = this.selectedCategoryId();

      if (!categoryId) return todos;
      return todos.filter((todo) => todo.categoryId === categoryId);
   });

   // ── Acciones de lista ─────────────────────────────────────────────────────
   addTodo(title: string, categoryId: string, priority: TodoPriority, description: string): void {
      this.todoService.add(title, categoryId, priority, description);
   }

   toggleTodo(id: string): void {
      this.todoService.toggle(id);
   }

   removeTodo(id: string): void {
      this.todoService.remove(id);
   }

   setFilter(filter: FilterType): void {
      this.todoService.setFilter(filter);
   }

   // Nuevo método para setear la categoría
   setCategoryFilter(categoryId: string | null): void {
      this.selectedCategoryId.set(categoryId);
   }

   // ── Acciones de detalle ───────────────────────────────────────────────────
   getTodoById(id: string): Todo | undefined {
      return this.todoService.getById(id);
   }

   updateTodo(id: string, changes: Partial<Pick<Todo, 'title' | 'description' | 'priority'>>): void {
      this.todoService.update(id, changes);
   }

   // ── Navegación ────────────────────────────────────────────────────────────
   goToDetail(id: string): void {
      this.router.navigate(['/todos', id]);
   }

   goToList(): void {
      this.router.navigate(['/todos']);
   }
}
