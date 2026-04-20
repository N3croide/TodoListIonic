import { Routes } from '@angular/router';

export const routes: Routes = [
   {
      path: 'home',
      loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
   },
   {
      path: 'todos',
      loadComponent: () => import('./features/todos/pages/todos-list/todos-list.page').then((m) => m.TodosListPage),
   },
   {
      path: 'todos/:id',
      loadComponent: () => import('./features/todos/pages/todo-detail/todo-detail.page').then((m) => m.TodoDetailPage),
   },
   {
      path: 'categories',
      loadComponent: () => import('./features/categories/pages/categories.page').then((m) => m.CategoriesListPage),
   },
   {
      path: '',
      redirectTo: '',
      pathMatch: 'full',
   },
];
