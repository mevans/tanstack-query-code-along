import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'todos',
    pathMatch: 'full',
  },
  {
    path: 'todos',
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./components/todo-list/todo-list.component').then(
            (m) => m.TodoListComponent,
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./components/todo-detail/todo-detail.component').then(
            (m) => m.TodoDetailComponent,
          ),
      },
    ],
  },
];
