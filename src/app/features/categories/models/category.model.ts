export interface Category {
  id:          string;
  name:        string;
  createdAt:   Date;
}

export function createCategory(name: string): Category {
  return {
    id:          crypto.randomUUID(),
    name:        name.trim(),
    createdAt:   new Date(),
  };
}
