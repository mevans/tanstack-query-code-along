import { inject, Injectable } from '@angular/core';
import {
  QueryClient,
  queryOptions,
} from '@tanstack/angular-query-experimental';
import { TodoApiService } from '../services/todo-api/todo-api.service';
import { lastValueFrom } from 'rxjs';
import { Todo } from '../types/todo.type';

@Injectable({
  providedIn: 'root',
})
export class TodoQueries {
  private readonly apiService = inject(TodoApiService);
  private readonly queryClient = inject(QueryClient);

  todoDetail({ id }: { id: Todo['id'] }) {
    return queryOptions({
      queryKey: ['todo', id],
      queryFn: () => lastValueFrom(this.apiService.getTodoById(id)),
      placeholderData: () => {
        const listTodos = this.queryClient.getQueryData(
          this.todoList().queryKey,
        );

        if (!listTodos) return undefined;

        const slim = listTodos.find((todo) => todo.id === id);
        return slim ? { ...slim, description: '' } : undefined;
      },
    });
  }

  todoList() {
    return queryOptions({
      queryKey: ['todos'],
      queryFn: () => lastValueFrom(this.apiService.getTodos()),
    });
  }
}
