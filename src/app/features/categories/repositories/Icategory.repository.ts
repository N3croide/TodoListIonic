import { Category } from "../models/category.model";

export interface ICategoryRepository {
  // ── Queries ─────────────────────────────────────────────
  findAll(): Promise<Category[]>;
  findById(id: string): Promise<Category | null>;

  // ── Commands ────────────────────────────────────────────
  add(
    name: string,
    id: string
  ): Promise<Category>;

  update(
    id: string,
    changes: Partial<Pick<Category, 'name'>>
  ): Promise<void>;

  remove(id: string): Promise<void>;
}
