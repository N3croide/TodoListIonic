import { makeEnvironmentProviders } from '@angular/core';
import { provideTodoDb } from './features/todos/todo.db';

export function DbProvider() {
  return makeEnvironmentProviders([
    provideTodoDb(),
  ]);
}
