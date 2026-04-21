import { inject, Injectable } from '@angular/core';
import { DatabaseService } from 'src/app/core/database/database.service';
import { ICategoryRepository } from './Icategory.repository';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryRepository implements ICategoryRepository {
   private readonly db = inject(DatabaseService);
   private readonly TABLE = 'categories';

   private toRow(category: Category) {
      return {
         id: category.id,
         name: category.name,
         created_at: category.createdAt.toISOString(),
      };
   }

   private toDomain(row: any): Category {
      return {
         id: row.id,
         name: row.name,
         createdAt: new Date(row.created_at),
      };
   }

   async findAll(): Promise<Category[]> {
      const rows = await this.db.select(this.TABLE);
      return rows.map((r) => this.toDomain(r));
   }

   async findById(id: string): Promise<Category | null> {
      const rows = await this.db.select(this.TABLE, { id });
      if (!rows.length) return null;
      return this.toDomain(rows[0]);
   }

   async add(name: string): Promise<Category> {
      const category: Category = { id: crypto.randomUUID(), name, createdAt: new Date() };
      await this.db.insert(this.TABLE, this.toRow(category));
      return category;
   }

   async update(id: string, changes: Partial<Pick<Category, 'name'>>): Promise<void> {
      if (!Object.keys(changes).length) return;
      await this.db.update(this.TABLE, changes, { id });
   }

   async remove(id: string): Promise<void> {
      await this.db.delete(this.TABLE, { id });
   }
}
