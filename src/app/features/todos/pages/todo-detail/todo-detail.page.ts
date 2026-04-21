import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';

import { IonicModule } from '@ionic/angular';
import { TodoFacade } from '../../todo.facade';
import { Todo, TodoPriority } from '../../models/todo.model';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

addIcons({ trashOutline });

@Component({
   selector: 'app-todo-detail',
   standalone: true,
   changeDetection: ChangeDetectionStrategy.OnPush,
   imports: [IonicModule, DatePipe, ReactiveFormsModule],
   templateUrl: './todo-detail.page.html',
   styles: `
      .button {
         height: 40px;
         margin: 0 20px;
         width: calc(50% - 40px);
         max-width: 200px;
      }
   `,
})
export class TodoDetailPage implements OnInit {
   form: FormGroup;
   todo = signal<Todo | null>(null);

   constructor(private readonly fb: FormBuilder) {
      this.form = this.fb.group({
         title: ['', Validators.required],
         description: [''],
         priority: ['medium'],
         categoryId: ['', Validators.required],
      });
   }

   returnToList() {
      return this.facade.goToList();
   }

   readonly facade = inject(TodoFacade);
   private readonly route = inject(ActivatedRoute);

   ngOnInit(): void {
      const id = this.route.snapshot.paramMap.get('id')!;
      const todo = this.facade.getTodoById(id);

      if (!todo) {
         this.facade.goToList();
         return;
      }

      this.todo.set(todo);

      this.form.patchValue({
         id: todo.id,
         title: todo.title,
         description: todo.description,
         priority: todo.priority,
         categoryId: todo.categoryId,
      });
   }

   save(): void {
      const t = this.form.getRawValue() as Pick<Todo, 'id' | 'title' | 'description' | 'priority'>;

      if (!t) return;
      this.facade.updateTodo(t.id, {
         title: t.title,
         description: t.description,
         priority: t.priority as TodoPriority,
      });
      this.facade.goToList();
   }

   delete(): void {
      const t = this.form.getRawValue() as Pick<Todo, 'id'>;
      if (!t) return;
      this.facade.removeTodo(t.id);
      this.facade.goToList();
   }
}
