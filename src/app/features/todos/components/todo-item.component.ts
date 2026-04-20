import { Component, input, output, computed, ChangeDetectionStrategy, signal, WritableSignal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { addIcons } from 'ionicons';
import { arrowBackOutline, pencilOutline, trashOutline } from 'ionicons/icons';
import { Todo } from '../models/todo.model';
import { IonicModule, IonItemSliding } from '@ionic/angular';
import { IonItemSlidingCustomEvent } from '@ionic/core';

addIcons({ pencilOutline, trashOutline, arrowBackOutline });

@Component({
   selector: 'app-todo-item',
   standalone: true,
   changeDetection: ChangeDetectionStrategy.OnPush,
   imports: [DatePipe, IonicModule],
   styleUrl: './todo-item.component.scss',
   templateUrl: './todo-item.component.html',
})
export class TodoItemComponent {

   onSlidingEvent($event: IonItemSlidingCustomEvent<any>) {
      let ratio = $event.detail.ratio;
      this.isSlidingOpen.set(ratio > 0.5);
      if(ratio > 1.8){
         this.delete.emit();
      }
   }

   readonly todo = input.required<Todo>();
   readonly toggle = output<void>();
   readonly edit = output<void>();
   readonly delete = output<void>();

   readonly priorityColor = computed(() => ({ low: 'success', medium: 'warning', high: 'danger' })[this.todo().priority]);

   isSlidingOpen: WritableSignal<Boolean> = signal(false);

   openSliding(slidingItem: IonItemSliding) {
      if (this.isSlidingOpen()) {
         slidingItem.open('start');
      } else {
         slidingItem.open('end');
      }
   }
}
