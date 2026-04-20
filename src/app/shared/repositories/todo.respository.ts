import { Observable } from 'rxjs';
import { Todo } from '../entities/todo.entity';

export abstract class ITodoRepository {
  abstract getAll():              Observable<Todo[]>;
  abstract getById(id: string):   Observable<Todo | undefined>;
  abstract save(todo: Todo):      Observable<Todo>;
  abstract update(todo: Todo):    Observable<Todo>;
  abstract delete(id: string):    Observable<void>;
  abstract deleteAll():           Observable<void>;
}
