import { Component, inject, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AlertController, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircleOutline, add, pencilOutline, trashOutline, keyOutline, checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons';
import { CategoryFacade } from '../category.facade';
import { Category } from '../models/category.model';

addIcons({
   addCircleOutline,
   add,
   pencilOutline,
   trashOutline,
   keyOutline,
   checkmarkCircleOutline,
   closeCircleOutline,
});

@Component({
   selector: 'app-categories-list',
   standalone: true,
   changeDetection: ChangeDetectionStrategy.OnPush,
   imports: [FormsModule, IonicModule],
   templateUrl: './categories.page.html',
   styleUrl: './categories.page.scss',
})
export class CategoriesListPage implements OnInit {
   readonly facade = inject(CategoryFacade);
   private readonly alert = inject(AlertController);
   private readonly toast = inject(ToastController);
   isOpen = signal(false);

   async ngOnInit() {
      await this.facade.load();
   }

   // readonly isActive = isActive;

   // Estado del formulario
   readonly editingId = signal<string | null>(null);
   formName = '';

   openModal(cat?: Category): void {
      if (cat) {
         this.editingId.set(cat.id);
         this.formName = cat.name;
      } else {
         this.resetForm();
      }

      this.isOpen.set(true);
   }

   resetForm(): void {
      this.editingId.set(null);
      this.formName = '';
   }

   submit(): void {
      if (!this.formName.trim()) return;
      const id = this.editingId();
      if (id) {
         this.facade.updateCategory(id, {
            name: this.formName.trim(),
         });
      } else {
         this.facade.addCategory(this.formName.trim());
      }

      this.isOpen.set(false);
   }

   async confirmDelete(cat: Category & { todoCount: number }): Promise<void> {
      if (cat.todoCount > 0) {
         const t = await this.toast.create({
            message: `No se puede eliminar "${cat.name}" — tiene ${cat.todoCount} tarea${cat.todoCount !== 1 ? 's' : ''} asociada${cat.todoCount !== 1 ? 's' : ''}.`,
            duration: 3000,
            color: 'warning',
            position: 'bottom',
         });
         await t.present();
         return;
      }

      const alert = await this.alert.create({
         header: 'Eliminar categoría',
         message: `¿Seguro que quieres eliminar "${cat.name}"?`,
         buttons: [
            { text: 'Cancelar', role: 'cancel' },
            {
               text: 'Eliminar',
               role: 'destructive',
               handler: () => this.facade.removeCategory(cat.id),
            },
         ],
      });
      await alert.present();
   }
}
