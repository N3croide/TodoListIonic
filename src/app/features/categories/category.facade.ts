import { Injectable, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from './service/category.service';
import { TodoService } from '../todos/services/todo.service';
import { Category } from './models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryFacade {
   private readonly categoryService = inject(CategoryService);
   private readonly todoService = inject(TodoService);
   private readonly router = inject(Router);

   // ── Signals expuestos ─────────────────────────────────────────────────────
   readonly categories = this.categoryService.categories;

   // Enriquece cada categoría con cuántos todos tiene
   readonly categoriesWithCount = computed(() =>
      this.categories().map((cat) => ({
         ...cat,
         todoCount: this.todoService.allTodos().filter((t) => t.categoryId === cat.id).length,
      })),
   );

   // ── Acciones ──────────────────────────────────────────────────────────────
   addCategory(name: string): void {
      this.categoryService.add(name);
   }

   updateCategory(id: string, changes: Partial<Pick<Category, 'name'>>): void {
      this.categoryService.update(id, changes);
   }

   /**
    * Retorna true si eliminó, false si tiene todos asociados
    */
   removeCategory(id: string): boolean {
      const hasTodos = this.todoService.allTodos().some((t) => t.categoryId === id);
      if (hasTodos) return false;
      this.categoryService.remove(id);
      return true;
   }

   getCategoryById(id: string): Category | undefined {
      return this.categoryService.getById(id);
   }

   getCategoryName(id: string | null): string {
      if (!id) return 'Sin categoría';
      return this.categoryService.getById(id)?.name ?? 'Sin categoría';
   }

   // ── Navegación ────────────────────────────────────────────────────────────
   goToCategories(): void {
      this.router.navigate(['/categories']);
   }
}
