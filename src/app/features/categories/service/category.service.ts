import { Injectable, inject, signal } from '@angular/core';
import { Category, createCategory } from '../models/category.model';
import { StorageService } from 'src/app/shared/services/storage.service';

@Injectable({ providedIn: 'root' })
export class CategoryService {
   private readonly storage = inject(StorageService);
   private readonly storageKey = 'categories';

   private readonly _categories = signal<Category[]>(this.loadFromStorage());

   // ── Computed públicos ─────────────────────────────────────────────────────
   readonly categories = this._categories.asReadonly();

   // ── Acciones ──────────────────────────────────────────────────────────────
   add(name: string): void {
      if (!name.trim()) return;
      this.mutate((cats) => [...cats, createCategory(name)]);
   }

   update(id: string, changes: Partial<Pick<Category, 'name'>>): void {
      this.mutate((cats) => cats.map((c) => (c.id === id ? { ...c, ...changes } : c)));
   }

   remove(id: string): void {
      this.mutate((cats) => cats.filter((c) => c.id !== id));
   }

   getById(id: string): Category | undefined {
      return this._categories().find((c) => c.id === id);
   }

   // ── Privado ───────────────────────────────────────────────────────────────
   private mutate(fn: (cats: Category[]) => Category[]): void {
      const next = fn(this._categories());
      this._categories.set(next);
      this.storage.set(this.storageKey, next);
   }

   private loadFromStorage(): Category[] {
      const raw = this.storage.get<Category[]>(this.storageKey);
      if (!raw) return [];
      return raw.map((c) => ({ ...c, createdAt: new Date(c.createdAt) }));
   }
}
