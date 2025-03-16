import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'todos',
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./todo-list/todo-list.component').then(
            (m) => m.TodoListComponent,
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./todo-detail/todo-detail.component').then(
            (m) => m.TodoDetailComponent,
          ),
      },
    ],
  },
];
