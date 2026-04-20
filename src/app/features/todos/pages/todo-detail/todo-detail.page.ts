import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';

import { IonicModule } from '@ionic/angular';
import { TodoFacade } from '../../todo.facade';
import { Todo, TodoPriority } from '../../models/todo.model';
import { DatePipe } from '@angular/common';

addIcons({ trashOutline });

@Component({
   selector: 'app-todo-detail',
   standalone: true,
   changeDetection: ChangeDetectionStrategy.OnPush,
   imports: [IonicModule, DatePipe],
   templateUrl: './todo-detail.page.html',
   styles:`
      .button{
         height: 40px;
         margin: 0 20px;
         width: calc(50% - 40px);
         max-width: 200px;
      }
`
})
export class TodoDetailPage implements OnInit {

   returnToList() {
      return this.facade.goToList();
   }

   readonly facade = inject(TodoFacade);
   private readonly route = inject(ActivatedRoute);

   readonly todo = signal<Todo | undefined>(undefined);
   readonly title = signal('');
   readonly description = signal('');
   readonly priority = signal<TodoPriority>('medium');
   readonly isDirty = signal(false);

   ngOnInit(): void {
      const id = this.route.snapshot.paramMap.get('id')!;
      const todo = this.facade.getTodoById(id);
      if (!todo) {
         this.facade.goToList();
         return;
      }

      this.todo.set(todo);
      this.title.set(todo.title);
      this.description.set(todo.description);
      this.priority.set(todo.priority);
   }

   save(): void {
      const t = this.todo();
      if (!t) return;
      this.facade.updateTodo(t.id, {
         title: this.title(),
         description: this.description(),
         priority: this.priority(),
      });
      this.facade.goToList();
   }

   delete(): void {
      const t = this.todo();
      if (!t) return;
      this.facade.removeTodo(t.id);
      this.facade.goToList();
   }
}
