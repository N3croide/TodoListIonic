import { Component, inject, ChangeDetectionStrategy, signal, WritableSignal, DestroyRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add, addCircleOutline, checkmarkDoneCircleOutline } from 'ionicons/icons';
import { TodoFacade } from '../../todo.facade';
import { Todo, TodoForm, TodoPriority } from '../../models/todo.model';
import { FilterType } from '../../services/todo.service';
import { TodoItemComponent } from '../../components/todo-item.component';
import { CategoryFacade } from 'src/app/features/categories/category.facade';
import { fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

addIcons({ add, addCircleOutline, checkmarkDoneCircleOutline });

@Component({
    selector: 'app-todos-list',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, IonicModule, TodoItemComponent, ReactiveFormsModule],
    templateUrl: './todos-list.page.html',
    styleUrl: './todos-list.page.scss',
})
export class TodosListPage {
    form: FormGroup;
    readonly facade = inject(TodoFacade);
    readonly categoriesFacade = inject(CategoryFacade);
    readonly alertController = inject(AlertController);

    readonly categories = this.categoriesFacade.categories();

    breakpointsCreationgModal = signal(window.innerHeight < 600 ? [0, 1] : [0, 0.6, 1]);

    private readonly destroyRef = inject(DestroyRef);

    getBreakpoints() {
        return window.innerHeight < 600 ? [0, 1] : [0, 0.6, 1];
    }

    constructor(private readonly fb: FormBuilder) {
        this.form = this.fb.group({
            title: ['', Validators.required],
            description: [''],
            priority: ['medium'],
            categoryId: ['', Validators.required],
        });

        fromEvent(window, 'resize')
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.breakpointsCreationgModal.set(this.getBreakpoints());
            });
    }

    setModalState(state: boolean) {
        this.isModalOpen.set(state);
    }

    newTitle = '';
    newDescription = '';
    newPriority: TodoPriority = 'medium';
    isModalOpen: WritableSignal<boolean> = signal(false);

    onFilter(e: CustomEvent): void {
        this.facade.setFilter(e.detail.value as FilterType);
    }

    isDeleteAlertOpen = false;

    async deleteTodo(todo: Todo): Promise<void> {
        if (this.isDeleteAlertOpen) {
            return; // Ya hay un alert abierto, no abras otro
        }
        this.isDeleteAlertOpen = true;

        const alert = await this.alertController.create({
            header: 'Confirmar eliminación',
            message: `Estas seguro que quieres borrar la tarea: "${todo.title}"?`,
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    handler: () => {
                        this.isDeleteAlertOpen = false;
                    },
                },
                {
                    text: 'Borrar',
                    role: 'destructive',
                    handler: () => {
                        this.facade.removeTodo(todo.id);
                        this.isDeleteAlertOpen = false;
                    },
                },
            ],
        });

        alert.onDidDismiss().then(() => {
            this.isDeleteAlertOpen = false;
        });

        await alert.present();
    }

    submit(): void {
        let data: TodoForm = this.form.getRawValue();
        if (this.form.invalid) return;
        this.facade.addTodo(data.title, data.description, data.priority, data.categoryId);
        this.isModalOpen.set(false);
    }
}
