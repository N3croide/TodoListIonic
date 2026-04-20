import { Injectable, inject, signal, computed } from '@angular/core';
import { Todo, TodoPriority, TodoStatus } from '../models/todo.model';
import { TodoRepository } from '../repositories/todo.repository';

export type FilterType = 'all' | TodoStatus;

@Injectable({ providedIn: 'root' })
export class TodoService {
    private readonly todoRepository = inject(TodoRepository);

    // ── Estado ───────────────────────────────────────────────
    private readonly _todos = signal<Todo[]>([]);
    private readonly _filter = signal<FilterType>('all');

    // ── Computed públicos ────────────────────────────────────
    readonly filter = this._filter.asReadonly();

    readonly pendingCount = computed(() => this._todos().filter((t) => t.status === 'pending').length);

    readonly completedCount = computed(() => this._todos().filter((t) => t.status === 'completed').length);

    readonly allCount = computed(() => this._todos().length);

    readonly filteredTodos = computed(() => {
        const f = this._filter();
        return f === 'all' ? this._todos() : this._todos().filter((t) => t.status === f);
    });

    // ── Inicialización ───────────────────────────────────────
    async load(): Promise<void> {
        const todos = await this.todoRepository.findAll();
        this._todos.set(todos);
    }

    // ── Acciones ─────────────────────────────────────────────
    async add(title: string,  categoryId: string, priority: TodoPriority = 'medium', description = ''): Promise<void> {
        if (!title.trim()) return;
        const todo = await this.todoRepository.add(title, description, priority, categoryId);
        this._todos.update((todos) => [...todos, todo]);
    }

    async toggle(id: string): Promise<void> {
        const current = this.getById(id);
        if (!current) return;
        const newStatus: TodoStatus = current.status === 'pending' ? 'completed' : 'pending';
        await this.todoRepository.toggle(id);
        this._todos.update((todos) => todos.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
    }

    async update(id: string, changes: Partial<Pick<Todo, 'title' | 'description' | 'priority'>>): Promise<void> {
        await this.todoRepository.update(id, changes);
        this._todos.update((todos) => todos.map((t) => (t.id === id ? { ...t, ...changes } : t)));
    }

    async remove(id: string): Promise<void> {
        await this.todoRepository.remove(id);
        this._todos.update((todos) => todos.filter((t) => t.id !== id));
    }

    getById(id: string): Todo | undefined {
        return this._todos().find((t) => t.id === id);
    }

    allTodos(): Todo[] {
        return this._todos();
    }

    setFilter(filter: FilterType): void {
        this._filter.set(filter);
    }
}
