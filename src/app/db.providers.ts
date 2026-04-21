import { makeEnvironmentProviders } from '@angular/core';
import { provideTodoDb } from './features/todos/todo.db';
import { provideCategoryDb } from './features/categories/category.db';

export function DbProvider() {
  return makeEnvironmentProviders([
    provideTodoDb(),
   provideCategoryDb(),
  ]);
}
