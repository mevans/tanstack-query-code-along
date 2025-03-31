import { inject, Injectable } from '@angular/core';
import { queryOptions } from '@tanstack/angular-query-experimental';
import { TodoApiService } from '../services/todo-api/todo-api.service';
import { lastValueFrom } from 'rxjs';
import { Todo } from '../types/todo.type';

@Injectable({
  providedIn: 'root',
})
export class TodoQueries {
  private readonly apiService = inject(TodoApiService);

  todoDetail({ id }: { id: Todo['id'] }) {
    return queryOptions({
      queryKey: ['todo', id],
      queryFn: () => lastValueFrom(this.apiService.getTodoById(id)),
    });
  }

  todoList() {
    return queryOptions({
      queryKey: ['todos'],
      queryFn: () => lastValueFrom(this.apiService.getTodos()),
    });
  }
}
