// ─── Domain Entity (SRP + no framework dependencies) ───────────────────────
export type TodoPriority = 'low' | 'medium' | 'high';
export type TodoStatus = 'pending' | 'completed';
export type TodoForm = {title: string; description: string; priority: TodoPriority; categoryId: string};

export interface Todo {
   id: string;
   title: string;
   description: string;
   status: TodoStatus;
   priority: TodoPriority;
   createdAt: Date;
   updatedAt: Date;
   categoryId?: string;
}

// Pure factory – no side effects
export function createTodo(partial: Pick<Todo, 'title' | 'description' | 'priority'>, categoryId: string): Todo {
   const now = new Date();
   return {
      id: crypto.randomUUID(),
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      categoryId: categoryId,
      ...partial,
   };
}

export function toggleTodo(todo: Todo): Todo {
   return {
      ...todo,
      status: todo.status === 'pending' ? 'completed' : 'pending',
      updatedAt: new Date(),
   };
}

export function updateTodo(todo: Todo, changes: Partial<Pick<Todo, 'title' | 'description' | 'priority'>>): Todo {
   return { ...todo, ...changes, updatedAt: new Date() };
}
