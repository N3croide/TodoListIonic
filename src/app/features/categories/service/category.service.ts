import { Injectable, inject, signal } from '@angular/core';
import { Category } from '../models/category.model';
import { CategoryRepository } from '../repositories/category.repository';

@Injectable({ providedIn: 'root' })
export class CategoryService {
   private readonly repo = inject(CategoryRepository);

   private readonly _categories = signal<Category[]>([]);

   readonly categories = this._categories.asReadonly();

   // ── Inicialización ────────────────────────────────────────
   async load(): Promise<void> {
      try{
         const cats = await this.repo.findAll();
         this._categories.set(cats);
      }catch(error){
         let err = JSON.stringify(error);
         alert('Error cargando categorías:\n ' + err);
      }
   }

   // ── Acciones ──────────────────────────────────────────────
   async add(name: string): Promise<void> {
      if (!name.trim()) return;
      const category = await this.repo.add(name);
      this._categories.update((cats) => [...cats, category]);
   }

   async update(id: string, changes: Partial<Pick<Category, 'name'>>): Promise<void> {
      await this.repo.update(id, changes);
      this._categories.update((cats) => cats.map((c) => (c.id === id ? { ...c, ...changes } : c)));
   }

   async remove(id: string): Promise<void> {
      await this.repo.remove(id);
      this._categories.update((cats) => cats.filter((c) => c.id !== id));
   }

   getById(id: string): Category | undefined {
      return this._categories().find((c) => c.id === id);
   }
}
